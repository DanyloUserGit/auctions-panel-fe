import axios from 'axios';
import io from 'socket.io-client';

// Адреса API задається в .env фронтенду (VITE_API_URL), щоб перенесення на інший сервер
// не вимагало змін коду (ТЗ 21). Приклад: VITE_API_URL=https://api.panel.caddyluck.com.ua
export const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

// Сервер автентифікує сокет сесій за cookie access_token, тому потрібні withCredentials
// та окреме з'єднання (forceNew), щоб після логіну/логауту не використовувались старі cookie.
export const socket = io(apiOrigin, {
  withCredentials: true,
  autoConnect: false,
  forceNew: true,
});
export const baseUrl = `${apiOrigin}/api`;
export const notificationSocket = io(`${apiOrigin}/notifications`, {
  withCredentials: true,
  autoConnect: false,
});

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
