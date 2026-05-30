import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

let csrfToken = null;
let csrfPromise = null;

export async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  if (csrfPromise) return csrfPromise;

  csrfPromise = api
    .get('/api/csrf-token')
    .then((res) => {
      csrfToken = res.data?.csrfToken || null;
      return csrfToken;
    })
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  const isWrite = method !== 'get' && method !== 'head' && method !== 'options';

  if (isWrite) {
    const token = await ensureCsrfToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['x-csrf-token'] = token;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 403 && String(error?.response?.data?.message || '').includes('CSRF')) {
      csrfToken = null;
    }
    throw error;
  }
);
