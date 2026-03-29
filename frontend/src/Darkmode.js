// darkMode.js - Dark mode toggle functionality

// Function to set dark mode
export function enableDarkMode() {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
  
  // Update toggle button icon - SUN (dark mode): BLACK filled sun
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    toggleBtn.setAttribute('title', 'Switch to Light Mode');
    toggleBtn.classList.add('dark-mode-active');
  }
}

// Function to set light mode
export function enableLightMode() {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', 'light');
  
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFA500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    toggleBtn.setAttribute('title', 'Switch to Dark Mode');
    toggleBtn.classList.remove('dark-mode-active');
  }
}

// Function to toggle between dark and light mode
export function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  if (currentTheme === 'dark') {
    enableLightMode();
  } else {
    enableDarkMode();
  }
}

// Function to initialize theme based on user preference or saved setting
export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    enableDarkMode();
  } else {
    enableLightMode();
  }
}