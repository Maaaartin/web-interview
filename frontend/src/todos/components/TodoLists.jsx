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
  CircularProgress,
  Stack,
  Button,
  CardActions,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { TodoListForm } from './TodoListForm';
import _ from 'lodash';
import {
  fetchTodoLists,
  fetchTodosForList,
  createTodo,
  // updateTodoList,
  deleteTodo,
  createTodoList,
  updateTodo,
} from '../../api.js';
import { useContext } from 'react';
import AlertContext from '../../Alert';

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({});
  const [activeList, setActiveList] = useState();
  const [newListName, setNewListName] = useState(null);
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

  const handleRemoveTodo = async (todo) => {
    try {
      await deleteTodo(todo.id);
      const updatedTodos = await fetchTodosForList(activeList);

      setTodoLists({
        ...todoLists,
        [activeList]: { ...todoLists[activeList], todos: updatedTodos },
      });
    } catch (e) {
      alertError('Failed to save changes', e.message);
    }
  };

  const handleCreateList = async () => {
    try {
      setNewListName(null);
      const createdList = await createTodoList(newListName);
      setTodoLists({
        ...todoLists,
        [createdList.id]: { ...createdList, todos: [] },
      });
    } catch (e) {
      alertError('Failed create new list', e.message);
    }
  };

  // const handleSaveList = async (id, { todos }) => {
  //   const listToUpdate = todoLists[id];
  //   const updatedLists = {
  //     ...todoLists,
  //     [id]: { ...listToUpdate, todos },
  //   };
  //   alertInfo('Saving changes...');
  //   try {
  //     await updateTodoList(updatedLists[id]);
  //     setTodoLists(updatedLists);
  //     alertSuccess('Changes saved');
  //   } catch (e) {
  //     alertError('Failed to save list', e.message);
  //   }
  // };

  useEffect(() => {
    (async () => {
      try {
        const lists = await fetchTodoLists();
        const allTodos = await Promise.all(
          Object.values(lists).map(async (td) => {
            return { ...td, todos: await fetchTodosForList(td.id) };
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

  if (_.isEmpty(todoLists)) {
    return (
      <Stack alignItems='center'>
        <CircularProgress />
      </Stack>
    );
  }

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

          {newListName !== null && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                autoFocus
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='Rakamakafon'
                value={newListName}
                onChange={(event) => setNewListName(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <ButtonGroup variant='text'>
                      <Button
                        sx={{ margin: '8px' }}
                        size='small'
                        color='error'
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
          // saveTodoList={handleSaveList}
          onAddTodo={handleAddTodo}
          onUpdateTodo={handleUpdateTodo}
          onRemoveTodo={handleRemoveTodo}
        />
      )}
    </Fragment>
  );
};
