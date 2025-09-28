import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
  baseURL: 'http://localhost:5000/',
});

API.interceptors.request.use((req) => {
  const cookieUser = Cookies.get('user');
  if (cookieUser) {
    const parsedUser = JSON.parse(cookieUser);
    req.headers.Authorization = `Bearer ${parsedUser.token}`;
    console.log('Auth Header:', req.headers.Authorization);
  }
  return req;
});

export default API;
