/* =============================================================
   js/features/forecast.js  |  Owner: Amdad
   Draws the 24-hour forecast and the 10-day forecast list.
   ============================================================= */

/** Draw 24 hourly cards starting from the current hour. */
function renderHourlyForecast() {
    const container = document.getElementById('hourlyforecastContainer');
    container.innerHTML = '';

    if (!currentWeatherData || !currentWeatherData.hourly) return;

    const hourly = currentWeatherData.hourly;
    const currentHour = new Date().getHours();     // start index = current hour

    for (let i = currentHour; i < currentHour + 24; i++) {
        if (!hourly.time[i]) break;                // stop if the data ends

        // Readable hour label like "3 PM"
        const hourDate = new Date(hourly.time[i]);
        const displayTime = hourDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

        const temp = formatTemp(hourly.temperature_2m[i]);

        // Pick an icon based on weather code and day/night
        const codeInfo = wmoWeatherMap[hourly.weather_code[i]] || FALLBACK_WEATHER;
        const isDaytime = hourDate.getHours() >= 6 && hourDate.getHours() <= 19;
        const iconName = isDaytime ? (codeInfo.isDayIcon || 'sun') : (codeInfo.isNightIcon || 'moon');

        // Build the card
        const card = document.createElement('div');
        card.className = 'hour-card';
        card.innerHTML = `
            <span class="hour-time">${i === currentHour ? 'Now' : displayTime}</span>
            <i data-lucide="${iconName}" class="icon-xl"></i>
            <span class="hour-temp">${temp}°</span>
        `;

        container.append(card);
    }

    lucide.createIcons();                          // draw the new icons
}

/** Draw one row for each of the 10 forecast days. */
function renderDayForecast() {
    const dayContainer = document.getElementById('dailyforecastContainer');
    if (!dayContainer) return;
    dayContainer.innerHTML = '';

    if (!currentWeatherData || !currentWeatherData.daily) return;

    const daily = currentWeatherData.daily;

    // The API already returns exactly 10 days (forecast_days=10)
    daily.time.forEach((dateStr, index) => {
        const date = new Date(dateStr + 'T00:00:00');
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateFormat = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const maxTemp = formatTemp(daily.temperature_2m_max[index]);
        const minTemp = formatTemp(daily.temperature_2m_min[index]);
        const codeInfo = wmoWeatherMap[daily.weather_code[index]] || { desc: 'variable', isDayIcon: 'sun' };

        // Build the row
        const row = document.createElement('div');
        row.className = 'day-row';
        row.innerHTML = `
            <div class="day-info">
                <p class="day-name">${dayName}</p>
                <p class="day-date txt-slate-300">${dateFormat}</p>
            </div>
            <div class="day-condition">
                <span><i data-lucide="${codeInfo.isDayIcon || 'sun'}" class="txt-amber-300"></i></span>
                <span class="day-desc txt-slate-200">${codeInfo.desc}</span>
            </div>
            <div class="day-temps">
                <span class="day-max">${maxTemp}°</span>
                <span class="day-min">${minTemp}°</span>
            </div>
        `;
        dayContainer.appendChild(row);
    });

    lucide.createIcons();
}