const themeRoot = document.documentElement;
const themeControl = document.querySelector("#theme-control");
const themeToggle = document.querySelector("#theme-toggle");
const themeStorageKey = "portfolio-theme";

function applyTheme(theme) {
    themeRoot.dataset.theme = theme;

    themeToggle.textContent = theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";
}

let savedTheme = "light";

try {
    if (localStorage.getItem(themeStorageKey) === "dark") {
        savedTheme = "dark";
    }
} catch {
    // Use the light default if storage is unavailable.
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const nextTheme = themeRoot.dataset.theme === "dark" ? "light" : "dark";

    function changeTheme() {
        applyTheme(nextTheme);

        try {
            localStorage.setItem(themeStorageKey, nextTheme);
        } catch {
            // The selected theme is already applied to this page.
        }
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (typeof document.startViewTransition === "function" && !prefersReducedMotion) {
        document.startViewTransition(changeTheme);
    } else {
        changeTheme();
    }
});

themeControl.hidden = false;