const BaseModel = require('./baseModel');

class Todo extends BaseModel {
  static dataFile = 'todo.json';

  static async findByListId(listId) {
    const data = await this.readAndParse();
    return Object.values(data).filter((d) => d.listId === listId);
  }

  get defaultValues() {
    return { title: null, listId: null };
  }
}

module.exports = Todo;
