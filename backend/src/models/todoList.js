const BaseModel = require('./baseModel');

class TodoList extends BaseModel {
  static dataFile = 'list.json';

  get defaultValues() {
    return { title: null, todoIds: [] };
  }
}

module.exports = TodoList;
