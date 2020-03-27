// for preventing the user borrowing the same book over and over again

const checkSameBook = (req, res, next) => {
  let userPresentBooks = req.user.dataValues.books.present;
  let book = req.book.dataValues;

  if (
    userPresentBooks.filter(userBook => userBook.name === book.name)
      .length > 0
  ) {
    return res
      .status(404)
      .send({ msg: `Book already exists in user's inventory` });
  }

  next();
};

module.exports = { checkSameBook };
