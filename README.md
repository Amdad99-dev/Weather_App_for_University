<h1 align="center">🌤️ SkyPulse – Live Weather Dashboard</h1>

<p align="center">
  A responsive weather dashboard built with pure HTML, CSS and JavaScript.<br/>
  Live data from the free Open-Meteo API – no API key, no backend.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/API-Open--Meteo-0ea5e9" alt="Open-Meteo" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## 📖 Description

SkyPulse shows current conditions, a 24-hour forecast, a 10-day outlook and key
metrics (humidity, wind, UV index, pressure, sunrise/sunset) for any city in the
world. The background theme changes with the weather and the time of day.

## ✨ Features

- 🔍 City search with live suggestions
- 📍 "Near Me" geolocation
- 🌡️ °C / °F switch
- ⭐ Favorite cities saved in the browser (localStorage)
- ⏱️ 24-hour and 📅 10-day forecasts
- 📊 Humidity, wind, UV, pressure, visibility and sun cycle
- 🎨 Dynamic background themes (clear, clouds, rain, snow, thunderstorm – day/night)
- 📱 Fully responsive glassmorphism design

## 🗂️ Folder Structure

```
skypulse-weather-dashboard/
├── index.html
├── README.md
├── .gitignore
├── css/
│   ├── base.css          # reset, themes, icons, glass effect
│   ├── layout.css        # header, grid, footer, responsive layout
│   └── components.css    # cards, forecasts, metrics, toast
└── js/
    ├── main.js           # entry point
    ├── ui/toast.js       # notification helper
    ├── config/constants.js     # API URLs, WMO map, shared state
    ├── utils/weatherUtils.js   # unit, wind, UV, time helpers
    ├── core/weatherCore.js     # API fetch, current weather, themes
    └── features/
        ├── search.js     # search + geolocation
        ├── favorites.js  # favorite cities
        └── forecast.js   # hourly + 10-day forecast
```

| Folder | Purpose |
|---|---|
| `css/` | Styles split by responsibility: base, layout, components |
| `js/config/` | Constants and shared state |
| `js/utils/` | Small reusable helper functions |
| `js/core/` | Main weather logic (API + current weather) |
| `js/features/` | Independent features (search, favorites, forecasts) |
| `js/ui/` | Small UI helpers (toast) |

## 👥 Team & Responsibilities

| Member | Responsibility | Files |
|---|---|---|
| Member | Role | Files |
|--------|------|-------|
| Member 1 | UI design, HTML/CSS, testing, documentation | `index.html`, `css/*`, `js/main.js`, `js/ui/toast.js`, `README.md` |
| Member 2 | API integration, current weather, metrics, themes, unit conversion | `js/config/constants.js`, `js/utils/weatherUtils.js`, `js/core/weatherCore.js` |
| Member 3 | Search, geolocation, favorites, hourly and 10-day forecasts | `js/features/search.js`, `js/features/favorites.js`, `js/features/forecast.js` |

## 🚀 Installation & Run

No build tools are required.

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/skypulse-weather-dashboard.git

# 2. Open the folder
cd skypulse-weather-dashboard

# 3a. Quick start: open index.html in your browser
# 3b. Recommended: run a local server (needed for "Near Me" geolocation)
python -m http.server 8000
# then visit http://localhost:8000
```

You can also use the **Live Server** extension in VS Code.

> Geolocation works only on `https://` or `http://localhost`.

## 🧪 Manual Testing Checklist

- [ ] Page loads with Cox's Bazar weather
- [ ] Searching a city (suggestion click and Enter key) loads its weather
- [ ] °C / °F switch updates current, hourly, 10-day, high, low and feels-like
- [ ] Star adds/removes a favorite; favorites remain after refresh
- [ ] Clicking a favorite chip loads that city; the × removes it
- [ ] "Near Me" asks permission and loads local weather
- [ ] Background theme changes for rain, clouds and clear weather
- [ ] Layout works on mobile (360px), tablet (768px) and desktop (1280px)

## 🛠️ Technologies

HTML5 · CSS3 (Flexbox, Grid, glassmorphism) · JavaScript ES6 (async/await, Fetch API) ·
Open-Meteo Forecast & Geocoding APIs · Lucide Icons · Google Fonts · localStorage

## 🔮 Future Improvements

- Weather alerts and air quality index
- Temperature charts
- Real visibility data from the API
- Light / dark mode toggle
- PWA with offline support
- Convert to ES modules with a bundler (Vite)
- Pin the Lucide version instead of `@latest`
- Unit tests for helper functions

## 📄 License

Released under the MIT License.

## 🙌 Credits

Weather data by [Open-Meteo](https://open-meteo.com/) · Icons by [Lucide](https://lucide.dev/)