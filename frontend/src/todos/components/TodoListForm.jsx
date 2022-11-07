import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import Debounce from '../../Debounce';
import { Todo } from './Todo';
export const TodoListForm = ({ todoList, onAddTodo, onUpdateTodo, onRemoveTodo }) => {
  const [todos, setTodos] = useState(todoList.todos);
  const todoDebounce = useRef(Debounce());

  useEffect(() => {
    setTodos(todoList.todos);
  }, [todoList.todos]);

  // destructor
  useEffect(() => () => todoDebounce.current?.cancel(), []);

  const haveEmptyTitle = todos.some((td) => td.title === '');

  const handleTodoChange = (index, prop, value, debounce = true) => {
    const updatedTodos = _.set(_.clone(todos), `[${index}].${prop}`, value);
    setTodos(updatedTodos);
    // do not update if title is empty
    if (updatedTodos[index].title === '') {
      return;
    }
    const action = () => onUpdateTodo(_.clone(updatedTodos[index]));
    if (debounce) {
      return todoDebounce.current?.exec(action);
    }
    action();
  };

  const handleRemoveTodo = (todo, index) => {
    // cancels pending update requests
    todoDebounce.current?.cancel();
    setTodos(todos.filter((_t, i) => i !== index));
    onRemoveTodo(todo);
  };

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todos.map((todo, index) => (
            <Todo
              key={index}
              index={index}
              todo={todo}
              onRemoveTodo={handleRemoveTodo}
              onTodoChange={handleTodoChange}
            />
          ))}
          <CardActions>
            <Button disabled={haveEmptyTitle} type='button' color='primary' onClick={onAddTodo}>
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  );
};
