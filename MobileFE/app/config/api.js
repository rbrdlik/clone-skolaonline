export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api'
    : 'https://your-api-domain.com/api',
  
  TIMEOUT: 10000,
};
