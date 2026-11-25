/* =============================================================
   js/config/constants.js  |  Owner: Member 2 (configuration)
   API endpoints, weather-code table and shared app state.
   Loaded FIRST so every other script can use these globals.
   ============================================================= */

// ---------- API endpoints (Open-Meteo, no API key needed) ----------
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// ---------- localStorage key ----------
// One key is now used for BOTH reading and saving favorites
const STORAGE_KEY = 'skypulse_favs';

// ---------- Default city shown on first load ----------
const DEFAULT_CITY = { lat: 21.4272, lon: 92.0058, name: "Cox's Bazar", country: "Bangladesh" };

// ---------- Used when the API returns an unknown weather code ----------
const FALLBACK_WEATHER = { desc: 'Variable weather', icon: 'cloud', theme: 'clear', isDayIcon: 'sun', isNightIcon: 'moon' };

// ---------- WMO weather code lookup table ----------
// code -> description, icon name, background theme, day icon, night icon
const wmoWeatherMap = {
    0: { desc: 'Clear sky', icon: 'sun', theme: 'clear', isDayIcon: 'sun', isNightIcon: 'moon' },
    1: { desc: 'Mainly clear', icon: 'cloud-sun', theme: 'clear', isDayIcon: 'cloud-sun', isNightIcon: 'cloud-moon' },
    2: { desc: 'Partly cloudy', icon: 'cloud-sun', theme: 'clouds', isDayIcon: 'cloud-sun', isNightIcon: 'cloud-moon' },
    3: { desc: 'Overcast', icon: 'cloud', theme: 'clouds', isDayIcon: 'cloud', isNightIcon: 'cloud' },
    45: { desc: 'Foggy', icon: 'cloud-fog', theme: 'clouds', isDayIcon: 'cloud-fog', isNightIcon: 'cloud-fog' },
    48: { desc: 'Rime fog', icon: 'cloud-fog', theme: 'clouds', isDayIcon: 'cloud-fog', isNightIcon: 'cloud-fog' },
    51: { desc: 'Light drizzle', icon: 'cloud-drizzle', theme: 'rain', isDayIcon: 'cloud-drizzle', isNightIcon: 'cloud-drizzle' },
    53: { desc: 'Moderate drizzle', icon: 'cloud-drizzle', theme: 'rain', isDayIcon: 'cloud-drizzle', isNightIcon: 'cloud-drizzle' },
    55: { desc: 'Dense drizzle', icon: 'cloud-rain', theme: 'rain', isDayIcon: 'cloud-rain', isNightIcon: 'cloud-rain' },
    61: { desc: 'Slight rain', icon: 'cloud-rain', theme: 'rain', isDayIcon: 'cloud-rain', isNightIcon: 'cloud-rain' },
    63: { desc: 'Moderate rain', icon: 'cloud-rain', theme: 'rain', isDayIcon: 'cloud-rain', isNightIcon: 'cloud-rain' },
    65: { desc: 'Heavy rain', icon: 'cloud-lightning', theme: 'rain', isDayIcon: 'cloud-lightning', isNightIcon: 'cloud-lightning' },
    71: { desc: 'Slight snow', icon: 'snowflake', theme: 'snow', isDayIcon: 'snowflake', isNightIcon: 'snowflake' },
    73: { desc: 'Moderate snow', icon: 'snowflake', theme: 'snow', isDayIcon: 'snowflake', isNightIcon: 'snowflake' },
    75: { desc: 'Heavy snow', icon: 'snowflake', theme: 'snow', isDayIcon: 'snowflake', isNightIcon: 'snowflake' },
    80: { desc: 'Rain showers', icon: 'cloud-rain', theme: 'rain', isDayIcon: 'cloud-rain', isNightIcon: 'cloud-rain' },
    81: { desc: 'Moderate showers', icon: 'cloud-rain', theme: 'rain', isDayIcon: 'cloud-rain', isNightIcon: 'cloud-rain' },
    82: { desc: 'Violent showers', icon: 'cloud-lightning', theme: 'rain', isDayIcon: 'cloud-lightning', isNightIcon: 'cloud-lightning' },
    95: { desc: 'Thunderstorm', icon: 'cloud-lightning', theme: 'thunderstorm', isDayIcon: 'cloud-lightning', isNightIcon: 'cloud-lightning' },
    96: { desc: 'Thunderstorm with hail', icon: 'cloud-hail', theme: 'thunderstorm', isDayIcon: 'cloud-hail', isNightIcon: 'cloud-hail' }
};

// ---------- Shared application state ----------
let currentUnit = 'C';          // 'C' = Celsius, 'F' = Fahrenheit
let activeCityData = null;      // { name, country, lat, lon } of the city on screen
let currentWeatherData = null;  // Raw JSON returned by Open-Meteo
let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');  // Saved cities