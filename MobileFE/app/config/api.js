// API Configuration
// Upravte BASE_URL podle vašeho backendu
// Pro lokální vývoj použijte IP adresu vašeho počítače místo localhost
// (např. 'http://192.168.1.100:3000/api' pro Android emulátor)

export const API_CONFIG = {
  // Development URL - upravte podle vašeho backendu
  // POZOR: Backend routy NEMAJÍ /api prefix, takže používáme pouze port
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000' // Pro iOS simulátor - BEZ /api
    // ? 'http://10.0.2.2:3000' // Pro Android emulátor - BEZ /api
    // ? 'http://192.168.1.XXX:3000' // Pro fyzické zařízení - nahraďte XXX vaší IP - BEZ /api
    : 'https://your-api-domain.com', // Production URL - BEZ /api
  
  // Timeout pro API požadavky (v milisekundách)
  TIMEOUT: 10000,
};

