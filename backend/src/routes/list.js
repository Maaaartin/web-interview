module.exports = () => {
  const router = require('express')(),
    TodoList = require('../models/todoList.js'),
    Todo = require('../models/todo.js'),
    Logger = require('../logger.js');

  router.get('/', async (_req, res) => {
    try {
      const tdList = await TodoList.getAll();
      res.json(tdList);
    } catch (e) {
      Logger.error('Failed to fetch todo lists', e);
      res.status(500).send(e.message);
    }
  });

  router.post('/', async (req, res) => {
    try {
      const tdList = await new TodoList(req.body).save();
      res.json(tdList.values);
    } catch (e) {
      Logger.error('Failed to create todo list', e);
      res.status(500).send(e.message);
    }
  });

  router.delete('/:listId', async (req, res) => {
    try {
      const { listId } = req.params;
      const [deletedList] = await Promise.all([
        TodoList.deleteById(listId),
        Todo.deleteByListId(listId),
      ]);

      res.json(deletedList);
    } catch (e) {
      Logger.error('Failed to delete todo list', e);
      res.status(500).send(e.message);
    }
  });

  return router;
};
