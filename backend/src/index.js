const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use('/api/list', require('./routes/list.js')());
app.use('/api/todo', require('./routes/todo.js')());

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
