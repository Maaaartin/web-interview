module.exports = () => {
  const router = require('express')(),
    TodoList = require('../models/todoList.js');

  router.get('/', async (_req, res) => {
    try {
      const list = await TodoList.getAll();
      res.json(list);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  return router;
};
