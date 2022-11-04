module.exports = () => {
  const router = require('express')(),
    TodoList = require('../models/todoList.js'),
    Todo = require('../models/todo.js');

  router.get('/', async (_req, res) => {
    try {
      const tdList = await TodoList.getAll();
      res.json(tdList);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  router.put('/:listId', async (req, res) => {
    // const tdList = await TodoList.getById(req.params.listId);

    // tdList.values = req.body
    return res.send('');
  });

  router.post('/', async (req, res) => {
    try {
      const tdList = await new TodoList(req.body).save();
      res.json(tdList.values);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  router.delete('/:listId', async (req, res) => {
    try {
      const { listId } = req.params;
      await TodoList.deleteById(listId);
      const deleted = await Todo.deleteByListId(listId);
      res.json(deleted);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  return router;
};
