const fs = require('fs/promises');

module.exports = () => () => {
  let data = JSON.stringify({});
  jest.spyOn(fs, 'access').mockImplementation(async () => true);
  jest.spyOn(fs, 'readFile').mockImplementation(async () => data);
  jest.spyOn(fs, 'writeFile').mockImplementation(async (_path, d) => (data = d));
};
