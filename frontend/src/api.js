import Axios from 'axios';
const BASE_URL = `http://${window.location.hostname}:3001`;

export const fetchTodoLists = async () => {
  const { data } = await Axios.get(BASE_URL.concat('/api/list'));
  return data;
};
