const mockFs = require('../__mocks__/fs.js'),
  TodoList = require('../src/models/todoList.js');

describe('TodoList model tests', () => {
  beforeEach(() => {
    TodoList.data = {};
    mockFs();
  });

  test('Data file name', () => {
    expect(TodoList.dataFile).toBe('list.json');
  });

  test('Create new todo list with default values', async () => {
    const list = await new TodoList().save();
    expect(list.values).toEqual({ id: list.id, todoIds: [], title: null });
  });

  test('Create new todo list with passed values', async () => {
    const todoList = await new TodoList({ title: 'title', todoIds: ['id'] }).save();
    expect(todoList.values).toEqual({ id: todoList.id, title: 'title', todoIds: ['id'] });
  });

  test('Exclude properties not present in default values', async () => {
    const todoList = await new TodoList({ extra: 'value' }).save();
    expect(todoList.values).toEqual({ id: todoList.id, todoIds: [], title: null });
  });

  test('Get all todo lists', async () => {
    const todoList = await new TodoList({ title: 'title', todoIds: ['id'] }).save();
    const allLists = await TodoList.getAll();
    expect(Object.keys(allLists)).toHaveLength(1);
    expect(allLists[todoList.id]).toEqual({
      id: todoList.id,
      title: 'title',
      todoIds: ['id'],
    });
  });

  test('Get by id', async () => {
    const list = await new TodoList().save();
    const savedList = await TodoList.getById(list.id);
    expect(savedList.values).toEqual(list.values);
  });

  test('Get by id - non existing record', async () => {
    const savedList = await TodoList.getById('id');
    expect(savedList).toBe(null);
  });

  test('Delete by id', async () => {
    const list = await new TodoList().save();
    const deleted = await TodoList.deleteById(list.id);
    expect(deleted).toEqual(list.values);
    const allLists = await TodoList.getAll();
    expect(Object.keys(allLists)).toHaveLength(0);
  });

  test('Delete by id - non existing record', async () => {
    const deleted = await TodoList.deleteById('id');
    expect(deleted).toBe(null);
  });
});
