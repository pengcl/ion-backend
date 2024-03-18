const BASE_URL = 'http://10.0.0.114';
const PORT = '8082';
const DOWNLOAD_PORT = '8082';
export const environment = {
  production: false,
  cacheType: 'localStorage',
  PREFIX_URL: `${BASE_URL}:${PORT}`,
  DOWNLOAD_URL: `${BASE_URL}:${DOWNLOAD_PORT}`,
};
