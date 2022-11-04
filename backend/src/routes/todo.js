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
      const { id } = req.params;
      const todo = await Todo.getById(id);
      if (!todo) {
        return res.status(404).send(`Todo with id ${id} not found`);
      }
      todo.values = req.body;
      await todo.save();
      res.json(todo.values);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await Todo.deleteById(id);
      if (!todo) {
        return res.status(200).end();
      }
      const tdList = await TodoList.getById(todo.listId);
      const todoIds = tdList.values.todoIds;
      tdList.values.todoIds = todoIds.filter((tdId) => tdId !== todo.id);
      await tdList.save();
      res.json(tdList.values);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  return router;
};
