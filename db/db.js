const Sequelize = require('sequelize');
const keys = require('./config.json');

// wrote the db username and password to a config.json file,
// you can change the keys['username] and keys['password'] to your db username and password values to access the db
module.exports = new Sequelize(
  'library',
  keys['username'],
  keys['password'],
  {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false
    }
  }
);
