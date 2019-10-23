const Sequelize = require('sequelize');

const db = require('../db/db');

const Book = db.define('book', {
    name: {
        type: Sequelize.STRING
    },
    score: {
        type: Sequelize.DOUBLE
    },
    reader_count: {
        type: Sequelize.INTEGER
    }
});

module.exports = Book;
