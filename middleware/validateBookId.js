const Book = require('../models/Book');

// for checking if a book with the same id exists or not
const validateBookId = async (req, res, next) => {
  try {
    let book = await Book.findOne({
      where: { id: req.params.bookid }
    });

    if (!book) {
      return res
        .status(404)
        .send({ msg: `Book with the given id doesn't exist` });
    }

    req.book = book;
    next();
  } catch (err) {
    res.status(500).send({ msg: err });
  }
};

module.exports = { validateBookId };
