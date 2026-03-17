// AUTH
function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// DATA
function getEmployees() {
    return JSON.parse(localStorage.getItem("employees")) || [];
}

function saveEmployees(data) {
    localStorage.setItem("employees", JSON.stringify(data));
}

function getVacations() {
    return JSON.parse(localStorage.getItem("vacations")) || [];
}

function saveVacations(data) {
    localStorage.setItem("vacations", JSON.stringify(data));
}

// 🔥 MODALS (FIX)
window.openModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("show");
};

window.closeModal = function() {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("show"));
};

// PERSONAL
window.addEmployee = function() {
    const input = document.getElementById("employeeName");
    if (!input) return;

    const name = input.value.trim();
    if (!name) return;

    let employees = getEmployees();
    employees.push({ id: Date.now(), name });

    saveEmployees(employees);
    input.value = "";

    loadEmployees();
};

// SEMESTER
window.addVacation = function() {
    const empId = document.getElementById("employeeSelect").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if (!empId || !start || !end) return;

    let vacations = getVacations();

    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start,
        end
    });

    saveVacations(vacations);
    renderCalendar();
};

// LOAD UI
function loadEmployees() {
    const employees = getEmployees();

    const select = document.getElementById("employeeSelect");
    const filter = document.getElementById("filter");

    if (!select || !filter) return;

    select.innerHTML = "";
    filter.innerHTML = '<option value="all">Visa alla</option>';

    employees.forEach(e => {
        select.innerHTML += `<option value="${e.id}">${e.name}</option>`;
        filter.innerHTML += `<option value="${e.id}">${e.name}</option>`;
    });
}

// CALENDAR
let calendar;

function renderCalendar() {
    const employees = getEmployees();
    const vacations = getVacations();

    const filterEl = document.getElementById("filter");
    const filter = filterEl ? filterEl.value : "all";

    const events = vacations.map(v => {
        const emp = employees.find(e => e.id == v.employee_id);
        return {
            title: emp ? emp.name : "?",
            start: v.start,
            end: v.end
        };
    });

    if (calendar) calendar.destroy();

    calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
        initialView: "dayGridMonth",
        events: events
    });

    calendar.render();
}

// INIT
window.addEventListener("DOMContentLoaded", () => {
    loadEmployees();
    renderCalendar();
});
