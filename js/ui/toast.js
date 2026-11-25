/* =============================================================
   js/ui/toast.js  |  Owner: Nowshin (UI / UX)
   Small helper that shows a temporary notification message.
   ============================================================= */

/**
 * Show a toast message for 3 seconds.
 * @param {string} message - Text to display to the user.
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    // Put the message text inside the toast box
    toastMsg.textContent = message;

    // Add the CSS class that fades and slides the toast in
    toast.classList.add('toast-visible');

    // Remove the class after 3 seconds so the toast hides again
    setTimeout(() => toast.classList.remove('toast-visible'), 3000);
}