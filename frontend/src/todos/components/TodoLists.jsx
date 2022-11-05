import React, { Fragment, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  ButtonGroup,
  Button,
  CardActions,
  ListItemButton,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { useContext } from 'react';
import AlertContext from '../../Alert';

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({});
  const [activeList, setActiveList] = useState(null);
  const [newListName, setNewListName] = useState(null);
  const { alertError, alertInfo, alertSuccess } = useContext(AlertContext);

  const updateTodosForList = async (action, errorTitle) => {
    try {
      await action();
      const updatedTodos = await fetchTodosForList(activeList);

      setTodoLists(
        _.set(
          _.clone(todoLists),
          activeList,
          _.set(_.clone(todoLists[activeList]), 'todos', updatedTodos)
        )
      );
    } catch (e) {
      alertError(errorTitle, e.message);
    }
  };
  const handleAddTodo = () =>
    updateTodosForList(() => createTodo(activeList), 'Failed to add new TODO');

  const handleRemoveTodo = (todo) =>
    updateTodosForList(() => deleteTodo(todo.id), 'Failed to save changes');

  const handleUpdateTodo = async (todo) => {
    try {
      const updateDoneStatus = (doneValue) => {
        setTodoLists(
          _.set(
            _.clone(todoLists),
            todo.listId,
            _.set(_.clone(todoLists[activeList]), 'done', doneValue)
          )
        );
      };

      updateDoneStatus(todoLists[todo.listId].todos.every((td) => td.checked));
      alertInfo('Saving changes...');
      await updateTodo(todo);
      alertSuccess('Changes saved');
    } catch (e) {
      alertError('Failed to save changes', e.message);
    }
  };

  const handleCreateList = async () => {
    try {
      setNewListName(null);
      const createdList = await createTodoList(newListName);
      setTodoLists(_.set(_.clone(todoLists), createdList.id, _.extend(createdList, { todos: [] })));
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

  useEffect(() => {
    (async () => {
      try {
        const lists = await fetchTodoLists();
        const allTodos = await Promise.all(
          Object.values(lists).map(async (td) => {
            const todos = await fetchTodosForList(td.id);
            const done = todos.every((td_) => td_.checked);
            return { ...td, todos, done };
          })
        );

        const todoList = allTodos.reduce((obj, item) => ({ ...obj, [item.id]: item }), {});
        setTodoLists(todoList);
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
          <CardActions>
            <Button type='button' color='primary' onClick={() => setNewListName('')}>
              Add List <AddIcon />
            </Button>
          </CardActions>
          {!_.isEmpty(todoLists) && (
            <List>
              {Object.entries(todoLists).map(([key, { title, done }]) => (
                <ListItem key={key} button onClick={() => setActiveList(key)}>
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary={title} />
                  <ListItemText primary={String(!!done)} />
                  <ListItemButton
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

          {newListName !== null && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                autoFocus
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='List name'
                value={newListName}
                onChange={(event) => setNewListName(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <ButtonGroup variant='text'>
                      <Button
                        sx={{ margin: '8px' }}
                        size='small'
                        color='secondary'
                        onClick={() => setNewListName(null)}
                      >
                        <ClearIcon />
                      </Button>
                      <Button
                        sx={{ margin: '8px' }}
                        size='small'
                        color='primary'
                        onClick={handleCreateList}
                      >
                        <AddIcon />
                      </Button>
                    </ButtonGroup>
                  ),
                }}
              />
            </div>
          )}
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
