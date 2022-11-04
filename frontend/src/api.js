import Axios from 'axios';
const BASE_URL = `http://${window.location.hostname}:3001`;

export const fetchTodoLists = async () => {
  const { data } = await Axios.get(BASE_URL.concat('/api/list'));
  return data;
};

export const fetchTodosForList = async (listId) => {
  const { data } = await Axios.get(BASE_URL.concat('/api/todo/', listId));
  return data;
};

export const createTodo = async (listId) => {
  const { data } = await Axios.post(BASE_URL.concat('/api/todo/', listId), {});
  return data;
};

export const updateTodo = async (todo) => {
  const { data } = await Axios.put(BASE_URL.concat('/api/todo/', todo.id), todo);
  return data;
};

export const updateTodoList = async (tdList) => {
  const { data } = await Axios.put(BASE_URL.concat('/api/list/', tdList.id), tdList);
  return data;
};

export const deleteTodo = async (todoId) => {
  const { data } = await Axios.delete(BASE_URL.concat('/api/todo/', todoId));
  return data;
};
