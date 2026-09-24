import axios from 'axios';
import io from 'socket.io-client';

// export const socket = io('https://api.panel.caddyluck.com.ua', {
//   withCredentials: true,
//   autoConnect: false,
//   forceNew: true,
// });
// export const baseUrl = `https://api.panel.caddyluck.com.ua/api`;
// export const notificationSocket = io(
//   'https://api.panel.caddyluck.com.ua/notifications',
//   {
//     withCredentials: true,
//     autoConnect: false,
//   },
// );

// Сервер автентифікує сокет сесій за cookie access_token, тому потрібні withCredentials
// та окреме з'єднання (forceNew), щоб після логіну/логауту не використовувались старі cookie.
export const socket = io('http://localhost:8000', {
  withCredentials: true,
  autoConnect: false,
  forceNew: true,
});
export const baseUrl = `http://localhost:8000/api`;
export const notificationSocket = io('http://localhost:8000/notifications', {
  withCredentials: true,
  autoConnect: false,
});

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
