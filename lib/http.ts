import axios from 'axios';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const http = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default http;
