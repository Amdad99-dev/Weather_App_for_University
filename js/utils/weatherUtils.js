/* =============================================================
   js/utils/weatherUtils.js  |  Owner: Tasrif (utilities)
   Pure helper functions: temperature unit conversion, wind
   direction, UV description, time formatting, safe DOM write.
   ============================================================= */

/**
 * Convert a Celsius value to the selected unit and round it.
 * @param {number} C - Temperature in Celsius.
 * @returns {number} Rounded temperature in °C or °F.
 */
function formatTemp(C) {
    if (currentUnit === 'F') {
        return Math.round((C * 9 / 5) + 32);   // Celsius -> Fahrenheit
    }
    return Math.round(C);
}

/**
 * Set text on an element only if that element exists.
 * @param {string} id   - Element id.
 * @param {string} text - Text to write.
 */
function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

/**
 * Convert wind degrees (0-360) to a compass direction name.
 * @param {number} degrees - Wind direction in degrees.
 * @returns {string} Direction such as "North-Northeast".
 */
function getWindDirection(degrees) {
    if (degrees === undefined || degrees === null) return 'N/A';

    const directions = [
        'North', 'North-Northeast', 'Northeast', 'East-Northeast',
        'East', 'East-Southeast', 'Southeast', 'South-Southeast',
        'South', 'South-Southwest', 'Southwest', 'West-Southwest',
        'West', 'West-Northwest', 'Northwest', 'North-Northwest'
    ];

    // 360 degrees / 16 sectors = 22.5 degrees per sector
    const index = Math.round((degrees % 360) / 22.5);
    return directions[index % 16];
}

/**
 * Describe a UV index value in plain words.
 * @param {number} uv - UV index.
 * @returns {string} Safety description.
 */
function getUVDescription(uv) {
    if (uv <= 2) return 'Low UV (Safe)';
    if (uv <= 5) return 'Moderate UV (Wear Sunscreen)';
    if (uv <= 7) return 'High UV (Seek Shade)';
    if (uv <= 10) return 'Very High UV (Protect Skin)';
    return 'Extreme Caution';
}

/**
 * Turn an ISO date string into a readable time like "6:05 AM".
 * @param {string} isoString - ISO date-time from the API.
 * @returns {string} Formatted time or '---'.
 */
function formatTimeStr(isoString) {
    if (!isoString) return '---';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}