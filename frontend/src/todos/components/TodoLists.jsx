import React, { Fragment, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { TodoListForm } from './TodoListForm';

import _ from 'lodash';
import { fetchTodoLists, fetchTodosForList, createTodo } from '../../api.js';

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({});
  const [activeList, setActiveList] = useState();

  useEffect(() => {
    (async () => {
      const todoLists = await fetchTodoLists();
      const allTodos = await Promise.all(
        Object.values(todoLists).map(async (td) => {
          return { ...td, todos: await fetchTodosForList(td.id) };
        })
      );

      const todoList = allTodos.reduce((obj, item) => ({ ...obj, [item.id]: item }), {});
      setTodoLists(todoList);
    })();
  }, []);

  if (_.isEmpty(todoLists)) {
    // TODO add spinner
    return null;
  }

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.entries(todoLists).map(([key, { title }]) => (
              <ListItem key={key} button onClick={() => setActiveList(key)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={(id, { todos }) => {
            const listToUpdate = todoLists[id];
            setTodoLists({
              ...todoLists,
              [id]: { ...listToUpdate, todos },
            });
          }}
          onAddTodo={() => {
            createTodo(activeList);
            console.log('object');
          }}
        />
      )}
    </Fragment>
  );
};
