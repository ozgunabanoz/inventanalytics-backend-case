// middleware function to check if the book that the user wants to return is in the user's present list
// if not, returns error message

const checkPresentBooks = (req, res, next) => {
  let userBooks = req.user.dataValues.books;
  let book = req.book.dataValues;

  if (
    userBooks.present.filter(userBook => userBook.name === book.name)
      .length === 0
  ) {
    return res.status(404).send({
      msg: `Book cannot be returned because the user doesn't own it`
    });
  }

  next();
};

module.exports = { checkPresentBooks };
