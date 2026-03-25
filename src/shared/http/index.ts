import axios from 'axios';
import io from 'socket.io-client';

// export const socket = io('https://auctions-be.duckdns.org');
// export const baseUrl = `https://auctions-be.duckdns.org/api`;
// export const notificationSocket = io(
//   'https://auctions-be.duckdns.org/notifications',
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
