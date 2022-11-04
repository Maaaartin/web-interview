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
import {
  fetchTodoLists,
  fetchTodosForList,
  createTodo,
  updateTodoList,
  updateTodo,
} from '../../api.js';
import { useContext } from 'react';
import AlertContext from '../../Alert';

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({});
  const [activeList, setActiveList] = useState();
  const { alertError, alertInfo, alertSuccess } = useContext(AlertContext);

  const handleAddTodo = async () => {
    try {
      await createTodo(activeList);
      const updatedTodos = await fetchTodosForList(activeList);

      setTodoLists({
        ...todoLists,
        [activeList]: { ...todoLists[activeList], todos: updatedTodos },
      });
    } catch (e) {
      alertError('Failed to add new TODO', e.message);
    }
  };

  const handleUpdateTodo = async (todo) => {
    try {
      alertInfo('Saving changes...');
      await updateTodo(todo);
      alertSuccess('Changes saved');
    } catch (e) {
      alertError('Failed to save changes', e.message);
    }
  };

  const handleSaveList = async (id, { todos }) => {
    const listToUpdate = todoLists[id];
    const updatedLists = {
      ...todoLists,
      [id]: { ...listToUpdate, todos },
    };
    alertInfo('Saving changes...');
    try {
      await updateTodoList(updatedLists[id]);
      setTodoLists(updatedLists);
      alertSuccess('Changes saved');
    } catch (e) {
      alertError('Failed to save list', e.message);
    }
  };

  useEffect(() => {
    (async () => {
      const lists = await fetchTodoLists();
      const allTodos = await Promise.all(
        Object.values(lists).map(async (td) => {
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
          saveTodoList={handleSaveList}
          onAddTodo={handleAddTodo}
          onUpdateTodo={handleUpdateTodo}
        />
      )}
    </Fragment>
  );
};
