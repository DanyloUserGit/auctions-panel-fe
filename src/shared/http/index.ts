import axios from 'axios';
import io from 'socket.io-client';

// export const socket = io('https://api.panel.caddyluck.com.ua');
// export const baseUrl = `https://api.panel.caddyluck.com.ua/api`;
// export const notificationSocket = io(
//   'https://api.panel.caddyluck.com.ua/notifications',
//   {
//     autoConnect: false,
//   },
// );

export const socket = io('http://localhost:8000');
export const baseUrl = `http://localhost:8000/api`;
export const notificationSocket = io('http://localhost:8000/notifications', {
  autoConnect: false,
});

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
