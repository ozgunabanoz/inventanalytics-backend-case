const db = require('./../db/db');
const { body, validationResult } = require('express-validator');
const _ = require('lodash');

const Book = require('../models/Book');
const upperFirstLetter = require('./../utils/upperFirstLetter');
const { validateBookId } = require('../middleware/validateBookId');

module.exports = app => {
  app.get('/books', async (req, res) => {
    try {
      let books = await Book.findAll({ order: [['id', 'ASC']] }); // getting all the books, ascending order by id
      let booksToSend = _.map(books, book => {
        return _.pick(book, ['id', 'name']);
      });

      res.status(200).send(booksToSend);
    } catch (err) {
      res.status(500).send({ msg: err });
    }
  });

  app.get('/books/:bookid', validateBookId, async (req, res) => {
    try {
      let bookToSend = _.pick(req.book, ['id', 'name', 'score']);

      res.status(200).send(bookToSend);
    } catch (err) {
      res.status(500).send({ msg: err });
    }
  });

  app.post(
    '/books',
    body('name').isLength({ min: 1 }),
    async (req, res) => {
      try {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).send({ msg: errors.array() });
        }

        let name = upperFirstLetter(req.body.name); // standardize books names

        await Book.create({ name: name });
        res.status(201).send();
      } catch (err) {
        res.status(500).send({ msg: err });
      }
    }
  );
};
