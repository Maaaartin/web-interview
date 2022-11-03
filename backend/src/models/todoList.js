const fs = require('fs/promises');

const path = `${__dirname}/../../.data/list.json`;

class TodoList {
  static async find() {
    try {
      const data = await fs.readFile(path, { encoding: 'utf-8' });
      return JSON.parse(data);
    } catch (e) {
      if (e.code === 'ENOENT') {
        return [];
      }
      throw e;
    }
  }

  constructor(props) {
    this.props = props;
  }

  async save() {
    return this.props;
  }
}

module.exports = TodoList;
