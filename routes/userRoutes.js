const db = require('./../db/db');
const { body, validationResult } = require('express-validator');
const _ = require('lodash');

const User = require('../models/User');
const Book = require('../models/Book');
const upperFirstLetter = require('./../utils/upperFirstLetter');
const { validateUserId } = require('../middleware/validateUserId');
const { validateBookId } = require('../middleware/validateBookId');
const { validateScore } = require('../middleware/validateScore');
const { checkSameBook } = require('../middleware/checkSameBook');
const {
  checkPresentBooks
} = require('../middleware/checkPresentBooks');
const { calculateScore } = require('../utils/calculateScore');

module.exports = app => {
  app.get('/users', async (req, res) => {
    try {
      let users = await User.findAll({ order: [['id', 'ASC']] }); // get all users in ascending order by id
      let usersToSend = _.map(users, user => {
        return _.pick(user, ['id', 'name']);
      });

      res.status(200).send(usersToSend);
    } catch (err) {
      res.status(500).send({ msg: err });
    }
  });

  app.get('/users/:userid', validateUserId, async (req, res) => {
    try {
      res.status(200).send(req.user);
    } catch (err) {
      res.status(500).send({ msg: err });
    }
  });

  app.post(
    '/users',
    body('name').isLength({ min: 1 }),
    async (req, res) => {
      try {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).send({ msg: errors.array() });
        }

        let name = upperFirstLetter(req.body.name); // standardize user names

        await User.create({
          name: name,
          books: { past: [], present: [] }
        });
        res.status(201).send();
      } catch (err) {
        res.status(500).send({ msg: err });
      }
    }
  );

  app.post(
    '/users/:userid/borrow/:bookid',
    validateUserId,
    validateBookId,
    checkSameBook,
    async (req, res) => {
      try {
        let userBooks = req.user.dataValues.books;

        userBooks.present.push({ name: req.book.dataValues.name }); // push the borrowed book to the present books list
        await User.update(
          { books: userBooks },
          {
            where: { id: req.params.userid },
            returning: true,
            plain: true
          }
        );
        res.status(204).send();
      } catch (err) {
        res.status(500).send({ msg: err });
      }
    }
  );

  app.post(
    '/users/:userid/return/:bookid',
    body('score')
      .isLength({ min: 1 })
      .isInt(),
    validateScore,
    validateUserId,
    validateBookId,
    checkPresentBooks,
    async (req, res) => {
      try {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).send({ msg: errors.array() });
        }

        let userBooks = req.user.dataValues.books;
        let book = req.book.dataValues;

        userBooks.past.push({
          // pushing the returned book to the past list
          name: book.name,
          score: req.body.score
        });
        _.remove(userBooks.present, {
          // removing it from the present list
          name: book.name
        });
        await User.update(
          { books: userBooks },
          {
            where: { id: req.params.userid }
          }
        );

        let { bookScore, bookReaderCount } = calculateScore(
          // calculating new overall score for the book
          book.score,
          book['reader_count'],
          req.body.score
        );

        await Book.update(
          { score: bookScore, reader_count: bookReaderCount },
          { where: { id: req.params.bookid } }
        );
        res.status(204).send();
      } catch (err) {
        res.status(500).send({ msg: err });
      }
    }
  );
};
