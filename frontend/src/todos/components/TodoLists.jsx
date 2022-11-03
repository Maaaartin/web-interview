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
import Axios from 'axios';

const fetchTodoLists = async () => {
  const { data } = await Axios.get(`http://${window.location.hostname}:3001/api/list`);

  return data;
};

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState([]);
  const [activeList, setActiveList] = useState();

  useEffect(() => {
    fetchTodoLists().then(setTodoLists);
  }, []);

  if (!todoLists.length) {
    return null;
  }
  const todoMap = todoLists.reduce((obj, item) => {
    return { ...obj, [item.id]: item };
  }, {});
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.keys(todoMap).map((key) => (
              <ListItem key={key} button onClick={() => setActiveList(key)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={todoMap[key].title} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      {todoMap[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoMap[activeList]}
          saveTodoList={(id, { todos }) => {
            const listToUpdate = todoMap[id];
            setTodoLists({
              ...todoMap,
              [id]: { ...listToUpdate, todos },
            });
          }}
        />
      )}
    </Fragment>
  );
};
