import axios from 'axios';

const http = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});
// Додаємо токен в кожен запит
http.interceptors.request.use(config => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Не логуємо токен, лише попереджаємо
    // eslint-disable-next-line no-console
    console.warn('NEXT_PUBLIC_NOTEHUB_TOKEN is missing');
  }
  return config;
});

export default http;
