// app.js (eller där din init ligger)

import { initializeStorage } from "./data.js";
import { renderEmployees } from "./employees.js";
import { renderCalendar } from "./calendar.js";

function initApp() {
  try {
    // 1. Säkerställ att storage finns
    initializeStorage();

    // 2. Rendera UI
    renderEmployees();
    renderCalendar();

    console.log("✅ App initialized");
  } catch (error) {
    console.error("❌ App failed to initialize:", error);
  }
}

// Kör när DOM är redo
window.addEventListener("DOMContentLoaded", initApp);
