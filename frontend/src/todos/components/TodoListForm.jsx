import React, { useState, useEffect, useRef } from 'react';
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';

export const TodoListForm = ({ todoList, saveTodoList, onAddTodo, onUpdateTodo }) => {
  const [todos, setTodos] = useState(todoList.todos);
  const indexToUpdate = useRef(-1);
  const isFirstRun = useRef(true);
  const updateTodoRef = useRef(
    _.debounce(() => {
      console.log(indexToUpdate.current);
      onUpdateTodo(todos[indexToUpdate.current]);
      // saveTodoList(todoList.id, { todos });
    }, 1000)
  );
  useEffect(() => {
    setTodos(todoList.todos);
  }, [todoList.todos]);
  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     isFirstRun.current = false;
  //     return;
  //   }

  //   updateTodoRef.current?.();
  // }, [todos]);
  // destructor
  useEffect(
    () => () => {
      isFirstRun.current = null;
      updateTodoRef.current?.cancel();
    },
    []
  );
  // TODO remove this?
  const handleSubmit = (event) => {
    event.preventDefault();
    saveTodoList(todoList.id, { todos });
  };

  const onInputChange = (event, index) => {
    setTodos(_.set(_.clone(todos), `[${index}].title`, event.target.value));
    indexToUpdate.current = index;
    updateTodoRef.current?.();
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
