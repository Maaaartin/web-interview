module.exports = () => {
  const router = require('express')(),
    Todo = require('../models/todo.js'),
    TodoList = require('../models/todoList.js');

  router.get('/:listId', async (req, res) => {
    try {
      const { listId } = req.params;
      const list = await Todo.findByListId(listId);
      if (!list) {
        return res.status(404).send(`List with id ${listId} not found`);
      }
      res.json(list);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  router.post('/:listId', async (req, res) => {
    try {
      const { listId } = req.params;
      const tdList = await TodoList.getById(listId);
      if (!tdList) {
        return res.status(404).send(`List with id ${listId} not found`);
      }
      const newTodo = new Todo({ listId: listId });
      tdList.values.todoIds = tdList.values.todoIds.concat(newTodo.id);
      await Promise.all([tdList.save(), newTodo.save()]);
      res.json(newTodo.values);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const todo = await Todo.getById(req.params.id);
      if (!todo) {
        return res.status(404).send(`Todo with id ${req.params.id} not found`);
      }
      todo.values = req.body;
      await todo.save();
      res.json(todo.values);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  return router;
};
