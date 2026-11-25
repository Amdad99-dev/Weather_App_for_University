/* =============================================================
   js/core/weatherCore.js  |  Owner: Tasrif (API integration)
   Calls the Open-Meteo Forecast API, reads the JSON, shows the
   current weather, key metrics and changes the background theme.
   Loaded after config/constants.js and utils/weatherUtils.js.
   ============================================================= */

/**
 * Fetch weather data from Open-Meteo for a given latitude/longitude,
 * then update the entire dashboard (current card, metrics, forecasts,
 * background theme).
 *
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @param {string} name - City display name.
 * @param {string} country - Country name.
 */
async function fetchWeatherByCoords(lat, lon, name, country) {
    activeCityData = { name, country, lat, lon };

    safeSetText('cityName', name);
    if (country) {
        const cityEl = document.getElementById('cityName');
        if (cityEl) cityEl.textContent = `${name}, ${country}`;
    }

    try {
        const now = new Date();
        safeSetText('currentDate', now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));

        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,visibility',
            hourly: 'temperature_2m,weather_code',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
            timezone: 'auto',
            forecast_days: '10'
        });

        const response = await fetch(`${FORECAST_API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        currentWeatherData = data;

        updateCurrentWeather(data.current);
        updateMetrics(data.current);
        updateTheme(data.current.weather_code, data.current.is_day);

        if (typeof renderHourlyForecast === 'function') {
            renderHourlyForecast();
        }
        if (typeof renderDayForecast === 'function') {
            renderDayForecast();
        }

        if (typeof updateFavoriteButton === 'function') {
            updateFavoriteButton();
        }

    } catch (err) {
        console.error('Weather fetch error:', err);
        showToast('Failed to load weather. Please try again.');
    }
}

/**
 * Update the current weather card (temperature, description, icon,
 * high/low, feels-like).
 *
 * @param {Object} c - The `current` object from the API response.
 */
function updateCurrentWeather(c) {
    if (!c) return;

    const temp = formatTemp(c.temperature_2m);
    safeSetText('currentTemp', temp);

    const tempDisplayEl = document.getElementById('tempDisplay');
    if (tempDisplayEl) {
        tempDisplayEl.textContent = currentUnit === 'F' ? '°F' : '°C';
    }

    const codeInfo = wmoWeatherMap[c.weather_code] || FALLBACK_WEATHER;
    safeSetText('weatherDesc', codeInfo.desc);

    const badgeEl = document.getElementById('weatherBadge');
    if (badgeEl) {
        badgeEl.textContent = codeInfo.desc;
    }

    const isDay = c.is_day === 1;
    const iconName = isDay
        ? (codeInfo.isDayIcon || 'sun')
        : (codeInfo.isNightIcon || 'moon');
    const iconContainer = document.getElementById('weatherIconContainer');
    if (iconContainer) {
        iconContainer.innerHTML = `<i data-lucide="${iconName}" class="icon-weather"></i>`;
        lucide.createIcons();
    }

    if (currentWeatherData && currentWeatherData.daily) {
        const daily = currentWeatherData.daily;
        const todayMax = formatTemp(daily.temperature_2m_max[0]);
        const todayMin = formatTemp(daily.temperature_2m_min[0]);
        safeSetText('highTemp', `${todayMax}°`);
        safeSetText('lowTemp', `${todayMin}°`);
    }

    const feelsLike = formatTemp(c.apparent_temperature);
    safeSetText('feelsLike', `${feelsLike}°`);
}

/**
 * Update the key metric tiles (humidity, wind, UV, pressure,
 * visibility, sunrise/sunset).
 *
 * @param {Object} c - The `current` object from the API response.
 */
function updateMetrics(c) {
    if (!c) return;

    safeSetText('metricHumidity', `${c.relative_humidity_2m}%`);
    const humEl = document.getElementById('humidityStatus');
    if (humEl) {
        humEl.textContent = c.relative_humidity_2m >= 70
            ? 'High humidity'
            : c.relative_humidity_2m <= 30
                ? 'Low humidity'
                : 'Comfortable';
    }

    const windSpeed = currentUnit === 'F'
        ? Math.round(c.wind_speed_10m * 1.60934)
        : Math.round(c.wind_speed_10m);
    const windUnit = currentUnit === 'F' ? 'mph' : 'km/h';
    safeSetText('metricWind', `${windSpeed}${windUnit}`);
    const windDir = getWindDirection(c.wind_direction_10m);
    const windEl = document.getElementById('windStatus');
    if (windEl) {
        windEl.textContent = `Direction: ${windDir}`;
    }

    safeSetText('metricUV', Math.round(c.uv_index));
    const uvEl = document.getElementById('uvStatus');
    if (uvEl) {
        uvEl.textContent = getUVDescription(c.uv_index);
    }

    safeSetText('metricPressure', `${Math.round(c.pressure_msl)} hPa`);
    const presEl = document.getElementById('pressureStatus');
    if (presEl) {
        presEl.textContent = c.pressure_msl >= 1015
            ? 'High pressure'
            : c.pressure_msl <= 1005
                ? 'Low pressure'
                : 'Normal';
    }

    const vis = c.visibility;
    const visEl = document.getElementById('metricVisibility');
    const visStatusEl = document.getElementById('visibilityStatus');
    if (visEl) {
        if (vis !== undefined && vis !== null) {
            const visKm = currentUnit === 'F'
                ? Math.round(vis / 1000 * 0.621371)
                : Math.round(vis / 1000);
            visEl.textContent = `${visKm} ${currentUnit === 'F' ? 'mi' : 'km'}`;
        } else {
            visEl.textContent = '10 km';
        }
    }
    if (visStatusEl) {
        visStatusEl.textContent = vis !== undefined && vis !== null
            ? (vis >= 10000 ? 'Excellent' : vis >= 5000 ? 'Good' : 'Reduced')
            : 'Data not available';
    }

    if (currentWeatherData && currentWeatherData.daily) {
        const daily = currentWeatherData.daily;
        safeSetText('sunriseTime', formatTimeStr(daily.sunrise[0]));
        safeSetText('sunsetTime', formatTimeStr(daily.sunset[0]));
    }
}

/**
 * Change the page background theme based on the weather code and
 * whether it is daytime or nighttime.
 *
 * @param {number} code - WMO weather code.
 * @param {number} isDay - 1 for day, 0 for night.
 */
function updateTheme(code, isDay) {
    const codeInfo = wmoWeatherMap[code] || FALLBACK_WEATHER;
    const isDaytime = isDay === 1;

    let themeKey = codeInfo.theme;

    document.body.className = document.body.className
        .split(/\s+/)
        .filter(c => !c.startsWith('theme-'))
        .join(' ')
        .trim();

    if (themeKey === 'clear') {
        document.body.classList.add(isDaytime ? 'theme-clear-day' : 'theme-clear-night');
    } else if (themeKey === 'clouds') {
        document.body.classList.add(isDaytime ? 'theme-clouds-day' : 'theme-clouds-night');
    } else {
        document.body.classList.add(`theme-${themeKey}`);
    }
}

/**
 * Switch the temperature unit (°C / °F) and re-render all values.
 *
 * @param {string} unit - 'C' or 'F'.
 */
function setUnit(unit) {
    if (unit === currentUnit) return;

    currentUnit = unit;

    const btnC = document.getElementById('unitC');
    const btnF = document.getElementById('unitF');
    if (btnC) btnC.classList.toggle('is-active', unit === 'C');
    if (btnF) btnF.classList.toggle('is-active', unit === 'F');

    if (currentWeatherData) {
        updateCurrentWeather(currentWeatherData.current);
        updateMetrics(currentWeatherData.current);
        if (typeof renderHourlyForecast === 'function') {
            renderHourlyForecast();
        }
        if (typeof renderDayForecast === 'function') {
            renderDayForecast();
        }
    }
}