import React, { Fragment, useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  ListItemButton,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { TodoListForm } from './TodoListForm';
import _ from 'lodash';
import {
  fetchTodoLists,
  fetchTodosForList,
  createTodo,
  deleteTodoList,
  deleteTodo,
  createTodoList,
  updateTodo,
} from '../../api.js';
import { AlertContext } from '../../Alert';
import { AddTodoListForm } from './AddListForm';

const allTodosDone = (todos) => !_.isEmpty(todos) && todos.every((td) => td.checked);
export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({});
  const [activeList, setActiveList] = useState(null);
  const { alertError, alertInfo, alertSuccess, alertWarning } = useContext(AlertContext);

  const updateTodosForList = async (action, errorTitle) => {
    try {
      await action();
      const updatedTodos = await fetchTodosForList(activeList);

      setTodoLists({
        ...todoLists,
        [activeList]: {
          ...todoLists[activeList],
          todos: updatedTodos,
          done: allTodosDone(updatedTodos),
        },
      });
    } catch (e) {
      alertError(errorTitle, e.message);
    }
  };
  const handleAddTodo = () =>
    updateTodosForList(() => createTodo(activeList), 'Failed to add new Todo');

  const handleRemoveTodo = (todo) =>
    updateTodosForList(() => deleteTodo(todo.id), 'Failed to save changes');
  const handleUpdateTodo = async (todo) => {
    try {
      setTodoLists({
        ...todoLists,
        [activeList]: {
          ...todoLists[activeList],
          done: allTodosDone(todoLists[todo.listId].todos),
        },
      });
      alertInfo('Saving changes...');
      await updateTodo(todo);
      alertSuccess('Changes saved');
    } catch (e) {
      alertError('Failed to save changes', e.message);
    }
  };

  const handleCreateList = async (listName) => {
    try {
      const createdList = await createTodoList(listName);
      setTodoLists({ ...todoLists, [createdList.id]: { ...createdList, todos: [] } });
      setActiveList(createdList.id);
    } catch (e) {
      alertError('Failed create new list', e.message);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteTodoList(listId);
      setTodoLists(_.omit(_.clone(todoLists), listId));
      if (activeList === listId) {
        setActiveList(null);
      }
    } catch (e) {
      alertError('Failed to delete list', e.message);
    }
  };

  const checkDueTodos = (listsWithTodos) => {
    const dueTodos = listsWithTodos
      .map((l) => l.todos)
      .flat()
      .filter((td) => !td.checked && td.isDue);

    switch (dueTodos.length) {
      case 0:
        return;
      case 1:
        const { title, due } = dueTodos[0];
        return alertWarning(
          'One task is overdue',
          `${title} was supposed to be done ${new Date(due).toLocaleString()}`
        );
      default:
        return alertWarning(
          'Multiple tasks are overdue',
          `Overdue tasks: ${dueTodos.map((td) => td.title).join(', ')}`
        );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const lists = await fetchTodoLists();
        const listsWithTodos = await Promise.all(
          Object.values(lists).map(async (td) => {
            const todos = await fetchTodosForList(td.id);
            const done = allTodosDone(todos);
            return { ...td, todos, done };
          })
        );
        checkDueTodos(listsWithTodos);
        const todoMap = listsWithTodos.reduce((obj, item) => ({ ...obj, [item.id]: item }), {});
        setTodoLists(todoMap);
      } catch (e) {
        alertError('Failed to fetch data', e.message);
      }
    })();
    // adding alertError to deps causes making multiple requests
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>

          {!_.isEmpty(todoLists) && (
            <List>
              {Object.entries(todoLists).map(([key, { title, done }]) => (
                <ListItem title={title} key={key} button onClick={() => setActiveList(key)}>
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary={title} />
                  {done && (
                    <ListItemIcon>
                      <CheckIcon color='primary' />
                    </ListItemIcon>
                  )}
                  <ListItemButton
                    title='Delete'
                    style={{ flex: 'revert' }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteList(key);
                    }}
                  >
                    <DeleteIcon color='secondary' />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
          <AddTodoListForm onCreateList={handleCreateList} />
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          onAddTodo={handleAddTodo}
          onUpdateTodo={handleUpdateTodo}
          onRemoveTodo={handleRemoveTodo}
        />
      )}
    </Fragment>
  );
};
