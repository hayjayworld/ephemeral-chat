const defaultBackendUrl = import.meta.env.DEV
  ? 'http://localhost:3001'
  : 'https://ephemeral-chat-f89j.onrender.com';

export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || defaultBackendUrl
).replace(/\/+$/, '');
