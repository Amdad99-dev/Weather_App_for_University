/* =============================================================
   js/features/search.js  |  Owner: Amdad
   City search with live suggestions, form submit,
   default city shortcut and "Near Me" geolocation.
   ============================================================= */

/**
 * Listen to typing and show up to 5 matching cities.
 * Called once from main.js.
 */
function handleSearchInput() {
    const searchInputEl = document.getElementById('searchInput');
    if (!searchInputEl) return;

    searchInputEl.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        const resultContainer = document.getElementById('searchResults');

        // Ignore very short text
        if (query.length < 2) {
            resultContainer.classList.add('hidden');
            return;
        }

        try {
            // Ask the geocoding API for matching cities
            const res = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
            const data = await res.json();

            resultContainer.innerHTML = '';

            // No match found
            if (!data.results) {
                resultContainer.innerHTML = '<div style="padding: 10px;">No cities found</div>';
                resultContainer.classList.remove('hidden');
                return;
            }

            // Remove duplicate city names
            const uniqueResults = data.results.filter((place, index, self) =>
                index === self.findIndex((t) => t.name.toLowerCase() === place.name.toLowerCase())
            );

            // Create one clickable row per city
            uniqueResults.forEach(place => {
                const item = document.createElement('div');
                item.style.padding = '10px';
                item.style.cursor = 'pointer';
                item.textContent = `${place.name}, ${place.country || ''}`;
                item.onclick = () => loadCity(place);
                resultContainer.appendChild(item);
            });

            resultContainer.classList.remove('hidden');
        } catch (err) {
            console.error('Search error:', err);
        }
    });
}

/**
 * Handle pressing Enter inside the search form.
 * FIX: this function was referenced in index.html but missing,
 * which caused a page reload on Enter.
 * @param {Event} event - The form submit event.
 */
async function searchWeather(event) {
    event.preventDefault();                          // stop the page reload
    const query = document.getElementById('searchInput').value.trim();
    if (query.length < 2) return;

    try {
        const res = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            loadCity(data.results[0]);               // use the best match
        } else {
            showToast('City not found. Try another name.');
        }
    } catch (err) {
        console.error('Search error:', err);
        showToast('Search failed. Please try again.');
    }
}

/**
 * Load weather for a city chosen from the suggestion list.
 * @param {Object} place - Geocoding result with latitude, longitude, name, country.
 */
function loadCity(place) {
    fetchWeatherByCoords(place.latitude, place.longitude, place.name, place.country);
    document.getElementById('searchInput').value = '';            // clear the box
    document.getElementById('searchResults').classList.add('hidden');
}

/** Load the default city (also used by the brand logo click). */
function loadCoxBazar() {
    fetchWeatherByCoords(DEFAULT_CITY.lat, DEFAULT_CITY.lon, DEFAULT_CITY.name, DEFAULT_CITY.country);
}

/** Detect the user's position with the browser and show local weather. */
function getUserLocation() {
    // Some browsers do not support geolocation
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser.');
        return;
    }

    showToast('Detecting location...');

    navigator.geolocation.getCurrentPosition(
        // Success: we received coordinates
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Try to find a readable place name for the coordinates
                const res = await fetch(`${GEOCODING_API_URL}?name=${latitude.toFixed(2)},${longitude.toFixed(2)}&count=1`);
                const data = await res.json();

                let name = 'Current Location';
                let country = '';

                if (data.results && data.results.length > 0) {
                    name = data.results[0].name;
                    country = data.results[0].country || '';
                }

                fetchWeatherByCoords(latitude, longitude, name, country);
                showToast('Loaded weather for your location!');
            } catch (e) {
                // Name lookup failed: still show weather using a generic name
                fetchWeatherByCoords(latitude, longitude, 'My Location', '');
            }
        },
        // Error: user denied permission or position unavailable
        () => showToast('Location access denied or unavailable.')
    );
}