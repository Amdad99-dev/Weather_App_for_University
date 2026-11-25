/* =============================================================
   js/features/favorites.js  |  Owner: Member 3
   Save, remove and display favorite cities (localStorage).
   ============================================================= */

/** Add or remove the city currently on screen from favorites. */
function toggleFavorite() {
    if (!activeCityData) return;

    // Find the city in the list (case-insensitive)
    const index = favorites.findIndex((a) => a.name.toLowerCase() === activeCityData.name.toLowerCase());

    if (index > -1) {
        favorites.splice(index, 1);                                  // already saved -> remove
        showToast(`Removed ${activeCityData.name} from Favorites.`);
    } else {
        favorites.push({ ...activeCityData });                       // not saved -> add a copy
        showToast(`Added ${activeCityData.name} to Favorites`);
    }

    // Persist the list in the browser
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));

    updateFavoriteButton();
    renderFavoritesChips();
}

/** Colour the star icon yellow when the current city is a favorite. */
function updateFavoriteButton() {
    if (!activeCityData) return;

    const isFav = favorites.some((a) => a.name.toLowerCase() === activeCityData.name.toLowerCase());

    const favIcon = document.getElementById('favIcon');
    if (favIcon) {
        favIcon.setAttribute('fill', isFav ? '#f59e0b' : 'none');    // filled or empty star
    }

    const favBtn = document.getElementById('favBtn');
    if (favBtn) {
        favBtn.classList.toggle('is-fav', isFav);
    }
}

/** Draw one clickable chip for every saved city. */
function renderFavoritesChips() {
    const container = document.getElementById('favoritesContainer');
    if (!container) return;

    container.innerHTML = '';

    // Empty state message
    if (favorites.length === 0) {
        container.innerHTML = '<span class="favorites-empty" style="font-size: 12px; color: rgba(203,213,225,0.6);">No saved cities. Search and click the star to save locations!</span>';
        return;
    }

    favorites.forEach((fav) => {
        const chip = document.createElement('button');
        chip.className = 'fav-chip glass-card-subtle';

        // data-city stores the city name so the remove button knows what to delete
        chip.innerHTML = `
           <i data-lucide="map-pin" class="icon-xs txt-cyan-300"></i>
           <span>${fav.name}</span>
           <i data-lucide="x" class="icon-xs remove-fav" style="cursor: pointer; opacity: 0.7; transition: 0.2s;" data-city="${fav.name}"></i>
        `;

        // Clicking the chip loads that city (ignore clicks on the remove icon)
        chip.onclick = (e) => {
            if (e.target.closest('.remove-fav')) return;
            fetchWeatherByCoords(fav.lat, fav.lon, fav.name, fav.country);
        };

        container.appendChild(chip);
    });

    // Turn the new <i data-lucide> tags into SVG icons
    lucide.createIcons();

    // Attach the remove (x) handlers after the icons exist
    container.querySelectorAll('.remove-fav').forEach((removeBtn) => {
        removeBtn.onclick = (e) => {
            e.stopPropagation();                                     // do not trigger the chip click
            const cityName = removeBtn.getAttribute('data-city');
            if (!cityName) return;

            favorites = favorites.filter(a => a.name.toLowerCase() !== cityName.toLowerCase());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));

            renderFavoritesChips();
            updateFavoriteButton();
            showToast(`Removed ${cityName} from Favorites.`);

            // Return to the default city after removing a chip
            if (typeof loadCoxBazar === 'function') {
                loadCoxBazar();
            }
        };
    });
}