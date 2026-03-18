/* ==========================================
   💾 DATA LAGER (localStorage)
========================================== */

// 🔹 Hämta anställda
function getEmployees() {
    return JSON.parse(localStorage.getItem("employees")) || [];
}

// 🔹 Spara anställda
function saveEmployees(data) {
    localStorage.setItem("employees", JSON.stringify(data));
}

// 🔹 Hämta semester
function getVacations() {
    return JSON.parse(localStorage.getItem("vacations")) || [];
}

// 🔹 Spara semester
function saveVacations(data) {
    localStorage.setItem("vacations", JSON.stringify(data));
}
