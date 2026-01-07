export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api'
    : 'https://your-api-domain.com/api',
  
  TIMEOUT: 10000,
};
// API Configuration
// Upravte BASE_URL podle vašeho backendu
// Pro lokální vývoj použijte IP adresu vašeho počítače místo localhost
// (např. 'http://192.168.1.100:3000/api' pro Android emulátor)

export const API_CONFIG = {
  // Development URL - upravte podle vašeho backendu
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' // Pro iOS simulátor
    // ? 'http://10.0.2.2:3000/api' // Pro Android emulátor
    // ? 'http://192.168.1.XXX:3000/api' // Pro fyzické zařízení - nahraďte XXX vaší IP
    : 'https://your-api-domain.com/api', // Production URL
  
  // Timeout pro API požadavky (v milisekundách)
  TIMEOUT: 10000,
};

