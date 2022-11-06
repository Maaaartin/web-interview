const mockFs = require('../__mocks__/fs.js'),
  Todo = require('../src/models/todo.js');

describe('Todo model tests', () => {
  beforeEach(() => {
    Todo.data = {};
    mockFs();
  });

  test('Data file name', () => {
    expect(Todo.dataFile).toBe('todo.json');
  });

  test('Create new todo with default values', async () => {
    const todo = await new Todo().save();
    expect(todo.values).toEqual({
      id: todo.id,
      listId: null,
      title: null,
      checked: false,
      due: null,
    });
  });

  test('Create new todo with passed values', async () => {
    const now = new Date().toISOString();
    const todo = await new Todo({
      listId: 'listId',
      title: 'title',
      checked: true,
      due: now,
    }).save();
    expect(todo.values).toEqual({
      id: todo.id,
      listId: 'listId',
      title: 'title',
      checked: true,
      due: now,
    });
  });

  test('Get all todos', async () => {
    const now = new Date();
    const todo = await new Todo({
      listId: 'listId',
      title: 'title',
      checked: true,
      due: now,
    }).save();
    const allTodos = await Todo.getAll();
    expect(Object.keys(allTodos)).toHaveLength(1);
    expect(allTodos[todo.id]).toEqual({
      id: todo.id,
      listId: 'listId',
      title: 'title',
      checked: true,
      due: now.toISOString(),
    });
  });

  test('Delete by list id', async () => {
    const [todo1, todo2] = await Promise.all([
      new Todo({ listId: '1' }).save(),
      new Todo({ listId: '2' }).save(),
    ]);
    const deleted = await Todo.deleteByListId('1');
    expect(deleted).toHaveProperty(todo1.id);
    const allTodos = await Todo.getAll();
    expect(Object.keys(allTodos)).toHaveLength(1);
    expect(allTodos).toHaveProperty(todo2.id);
  });

  test('Get by id', async () => {
    const todo = await new Todo().save();
    const savedTodo = await Todo.getById(todo.id);
    expect(savedTodo.values).toEqual(todo.values);
  });

  test('Get by id - non existing record', async () => {
    const savedTodo = await Todo.getById('id');
    expect(savedTodo).toBe(null);
  });

  test('Delete by id', async () => {
    const todo = await new Todo().save();
    const deleted = await Todo.deleteById(todo.id);
    expect(deleted).toEqual(todo.values);
    const allTodos = await Todo.getAll();
    expect(Object.keys(allTodos)).toHaveLength(0);
  });

  test('Delete by id - non existing record', async () => {
    const deleted = await Todo.deleteById('id');
    expect(deleted).toBe(null);
  });
});
