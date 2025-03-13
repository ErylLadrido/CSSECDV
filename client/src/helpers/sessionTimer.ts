let timeout: number; 
const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes
// const TIMEOUT_DURATION = 10 * 1000; // 10 seconds for testing

export function startSessionTimer (onTimeout: () => void) {
    const resetTimer = () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(onTimeout, TIMEOUT_DURATION); // Use 'window.setTimeout'
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];

    // Add event listeners
    activityEvents.forEach(event => document.addEventListener(event, resetTimer));

    // Initialize the timer
    resetTimer();

    return () => {
        // Cleanup function to remove event listeners
        clearTimeout(timeout);
        activityEvents.forEach(event => document.removeEventListener(event, resetTimer));
    };
}
