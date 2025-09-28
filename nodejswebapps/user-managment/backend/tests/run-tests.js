const path = require('path');
const { tests } = require('./control');

tests.forEach(({ file, enabled }) => {
  if (enabled) {
    require(path.resolve(__dirname, file));
  }
});
