const BASE_URL = 'https://micoapi.bihetech.com';
const PORT = '13020';
const DOWNLOAD_PORT = '13023';
export const environment = {
  production: true,
  cacheType: 'memory',
  PREFIX_URL: `${BASE_URL}:${PORT}`,
  DOWNLOAD_URL: `${BASE_URL}:${DOWNLOAD_PORT}`,
};
