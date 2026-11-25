/* =============================================================
   js/main.js  |  Owner: Member 1 (entry point)
   Starts the application once the page has finished loading.
   Must be the LAST script loaded in index.html.
   ============================================================= */

window.addEventListener('DOMContentLoaded', () => {
    // 1. Draw all Lucide icons that exist in the HTML
    lucide.createIcons();

    // 2. Load the default city (Cox's Bazar) on first visit
    loadCoxBazar();

    // 3. Start listening to typing in the search box (suggestions)
    handleSearchInput();

    // 4. Hide the suggestion dropdown when the user clicks elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchInput') && !e.target.closest('#searchResults')) {
            document.getElementById('searchResults').classList.add('hidden');
        }
    });

    // 5. Connect the "Near Me" button to the geolocation feature
    document.getElementById('geoBtn').addEventListener('click', getUserLocation);
});