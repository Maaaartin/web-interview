import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import Debounce from '../../Debounce';

export const TodoListForm = ({ todoList, saveTodoList, onAddTodo, onUpdateTodo, onRemoveTodo }) => {
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

  const onTodoChange = (index, prop, value) => {
    const updatedTodos = _.set(_.clone(todos), `[${index}].${prop}`, value);
    setTodos(updatedTodos);
    todoDebounce.current?.exec(() => onUpdateTodo(_.clone(updatedTodos[index])));
  };

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todos.map((todo, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={todo.title || ''}
                onChange={(event) => onTodoChange(index, 'title', event.target.value)}
              />
              <Checkbox
                checked={!!todo.checked}
                value={!!todo.checked}
                onChange={() => onTodoChange(index, 'checked', !todos[index].checked)}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => {
                  setTodos(todos.filter((_t, i) => i !== index));
                  onRemoveTodo(todo);
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
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
};
