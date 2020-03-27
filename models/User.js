const Sequelize = require('sequelize');

const db = require('../db/db');

const User = db.define('user', {
  name: {
    type: Sequelize.STRING
  },
  books: {
    type: Sequelize.JSONB
  }
});

module.exports = User;
