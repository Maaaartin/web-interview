import Axios from 'axios';

const BASE_URL = `http://${window.location.hostname}:3001`;

export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/**
 *
 * @param {import('axios').AxiosRequestConfig} config
 * @returns {any} data
 */
const makeRequest = async (config) => {
  try {
    const { data } = await Axios(config);
    return data;
  } catch (e) {
    if (Axios.isAxiosError(e)) {
      throw new HttpError(e.response?.data || e.message, e.response?.status);
    }
    if (e instanceof Error) {
      throw e;
    }
    throw new Error('Unknown error');
  }
};

export const fetchTodoLists = () => {
  return makeRequest({ url: BASE_URL.concat('/api/list'), method: 'GET' });
};

export const fetchTodosForList = (listId) => {
  return makeRequest({ url: BASE_URL.concat('/api/todo/', listId), method: 'GET' });
};

export const createTodoList = (title) => {
  return makeRequest({ url: BASE_URL.concat('/api/list/'), method: 'POST', data: { title } });
};

export const createTodo = (listId) => {
  return makeRequest({ url: BASE_URL.concat('/api/todo/', listId), method: 'POST' });
};

export const updateTodo = (todo) => {
  return makeRequest({ url: BASE_URL.concat('/api/todo/', todo.id), method: 'PUT', data: todo });
};

export const updateTodoList = (tdList) => {
  return makeRequest({
    url: BASE_URL.concat('/api/list/', tdList.id),
    method: 'PUT',
    data: tdList,
  });
};

export const deleteTodo = (todoId) => {
  return makeRequest({
    url: BASE_URL.concat('/api/todo/', todoId),
    method: 'DELETE',
  });
};
