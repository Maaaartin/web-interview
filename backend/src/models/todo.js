const BaseModel = require('./baseModel');

class Todo extends BaseModel {
  static dataFile = 'todo.json';

  static async findByListId(listId) {
    const data = await this.readAndParse();
    return Object.values(data).filter((d) => d.listId === listId);
  }

  static async deleteByListId(listId) {
    const data = await this.readAndParse();
    const { include, exclude } = Object.values(data).reduce(
      (acc, td) => {
        if (td.listId !== listId) {
          return { ...acc, include: { ...acc.include, [td.id]: td } };
        }
        return { ...acc, exclude: { ...acc.exclude, [td.id]: td } };
      },
      { include: {}, exclude: {} }
    );

    await this.write(include);
    return exclude;
  }

  get defaultValues() {
    return { title: null, listId: null };
  }
}

module.exports = Todo;
