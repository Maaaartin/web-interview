import React, { useState, useEffect, useRef } from 'react';
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import Debounce from '../../Debounce';

export const TodoListForm = ({ todoList, saveTodoList, onAddTodo, onUpdateTodo }) => {
  const [todos, setTodos] = useState(todoList.todos);
  const todoDebounce = useRef(Debounce());

  useEffect(() => {
    setTodos(todoList.todos);
  }, [todoList.todos]);

  // destructor
  useEffect(
    () => () => {
      todoDebounce.current?.cancel();
    },
    []
  );
  // TODO remove this?
  const handleSubmit = (event) => {
    event.preventDefault();
    saveTodoList(todoList.id, { todos });
  };

  const onInputChange = (event, index) => {
    const updatedTodos = _.set(_.clone(todos), `[${index}].title`, event.target.value);
    setTodos(updatedTodos);
    todoDebounce.current?.exec(() => onUpdateTodo(_.clone(updatedTodos[index])));
  };

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos.map((todo, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={todo.title || ''}
                onChange={(event) => onInputChange(event, index)}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => {
                  setTodos(todos.filter((_t, i) => i !== index));
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button type='button' color='primary' onClick={onAddTodo}>
              Add Todo <AddIcon />
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
};
