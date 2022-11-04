import React, { useState } from 'react';
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from 'react';
import _ from 'lodash';
import { useRef } from 'react';

export const TodoListForm = ({ todoList, saveTodoList, onAddTodo }) => {
  const [todos, setTodos] = useState(todoList.todos);
  const isFirstRun = useRef(true);
  useEffect(() => {
    setTodos(todoList.todos);
  }, [todoList.todos]);

  const saveTodosDebound = useRef(
    _.debounce(() => {
      saveTodoList(todoList.id, { todos });
    }, 1000)
  );
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    saveTodosDebound.current?.();
  }, [todos]);
  const handleSubmit = (event) => {
    event.preventDefault();
    saveTodoList(todoList.id, { todos });
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
                onChange={(event) => {
                  setTodos(_.set(_.clone(todos), `[${index}].title`, event.target.value));
                }}
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
            <Button
              type='button'
              color='primary'
              onClick={() => {
                onAddTodo();
              }}
            >
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
