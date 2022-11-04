module.exports = () => {
  const router = require('express')(),
    TodoList = require('../models/todoList.js');

  router.get('/', async (_req, res) => {
    try {
      const tdList = await TodoList.getAll();
      res.json(tdList);
    } catch (e) {
      // TODO check error on frontend
      res.status(500).send(e.message);
    }
  });

  router.put('/:listId', async (req, res) => {
    // const tdList = await TodoList.getById(req.params.listId);

    // tdList.values = req.body
    return res.send('');
  });

  return router;
};
