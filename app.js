import { initializeStorage } from "./data.js";
import { initEmployees, addEmployee } from "./employees.js";
import { renderCalendar } from "./calendar.js";
import { initModal } from "./ui.js";

function initApp() {
  try {
    initializeStorage();
    initModal();
    initEmployees();
    renderCalendar();

    setupUI();

    console.log("✅ App started");
  } catch (err) {
    console.error("❌ Init error:", err);
  }
}

function setupUI() {
  const btn = document.getElementById("add-employee");

  btn.addEventListener("click", () => {
    const name = document.getElementById("emp-name").value;
    const phone = document.getElementById("emp-phone").value;

    if (!name) return;

    addEmployee(name, phone);

    document.getElementById("emp-name").value = "";
    document.getElementById("emp-phone").value = "";
  });
}

window.addEventListener("DOMContentLoaded", initApp);
