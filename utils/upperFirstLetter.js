const _ = require('lodash');

module.exports = str => {
  return str
    .toLowerCase() // first making all words lowercase
    .split(' ')
    .map(_.upperFirst) // then make only first letters uppercase
    .join(' ');
};
