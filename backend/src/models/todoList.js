const BaseModel = require('./baseModel');

/**
 * Model for Todo lists data
 * List can link to multiple todos
 */
class TodoList extends BaseModel {
  static dataFile = 'list.json';

  get defaultValues() {
    return { title: null, todoIds: [] };
  }
}

module.exports = TodoList;
