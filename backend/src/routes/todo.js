module.exports = () => {
  const router = require('express')(),
    Todo = require('../models/todo.js'),
    TodoList = require('../models/todoList.js');

  router.get('/:listId', async (req, res) => {
    try {
      const list = await Todo.findByListId(req.params.listId);
      res.json(list);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  router.post('/:listId', async (req, res) => {
    const { listId } = req.params;
    const newTodo = await new Todo({ listId: listId }).save();
    const tdList = await TodoList.getById(listId);
    tdList.values.todoIds = tdList.values.todoIds.concat(newTodo.id);
    await tdList.save();
    res.send(newTodo);
  });

  return router;
};
