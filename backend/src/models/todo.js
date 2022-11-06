const BaseModel = require('./baseModel');

class Todo extends BaseModel {
  static dataFile = 'todo.json';

  static async findByListId(listId) {
    const data = await this.getData();
    return Object.values(data).filter((d) => d.listId === listId);
  }

  static async deleteByListId(listId) {
    const data = await this.getData();
    const { include, exclude } = Object.values(data).reduce(
      (acc, td) => {
        if (td.listId !== listId) {
          return { ...acc, include: { ...acc.include, [td.id]: td } };
        }
        return { ...acc, exclude: { ...acc.exclude, [td.id]: td } };
      },
      { include: {}, exclude: {} }
    );
    this.data = include;
    await this.write();
    return exclude;
  }

  get defaultValues() {
    return { title: null, listId: null, checked: false };
  }
}

module.exports = Todo;
