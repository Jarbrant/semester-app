/*
==========================================
SEMESTERPLANERING - GITHUB PAGES VERSION
==========================================

Data lagras i localStorage:
- employees
- vacations
*/

// ==========================================
// 🔹 HÄMTA DATA
// ==========================================

function getEmployees() {
    return JSON.parse(localStorage.getItem("employees")) || [];
}

function getVacations() {
    return JSON.parse(localStorage.getItem("vacations")) || [];
}

// ==========================================
// 👥 LÄGG TILL PERSONAL
// ==========================================

function addEmployee() {
    const name = document.getElementById("employeeName").value;
    if (!name) return;

    let employees = getEmployees();

    employees.push({
        id: Date.now(),
        name: name
    });

    localStorage.setItem("employees", JSON.stringify(employees));

    document.getElementById("employeeName").value = "";

    loadEmployees();
    renderCalendar();
}

// ==========================================
// 📅 LÄGG TILL SEMESTER
// ==========================================

function addVacation() {
    const empId = document.getElementById("employeeSelect").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if (!empId || !start || !end) return;

    let vacations = getVacations();

    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start: start,
        end: end
    });

    localStorage.setItem("vacations", JSON.stringify(vacations));

    renderCalendar();
}

// ==========================================
// 🔹 LADDA PERSONAL I UI
// ==========================================

function loadEmployees() {
    const employees = getEmployees();

    const select = document.getElementById("employeeSelect");
    const filter = document.getElementById("filter");

    select.innerHTML = "";
    filter.innerHTML = '<option value="all">Visa alla</option>';

    employees.forEach(emp => {
        const option = `<option value="${emp.id}">${emp.name}</option>`;
        select.innerHTML += option;
        filter.innerHTML += option;
    });
}

// ==========================================
// 📅 RENDERA KALENDER
// ==========================================

let calendar;

function renderCalendar() {
    const employees = getEmployees();
    const vacations = getVacations();
    const filter = document.getElementById("filter").value;

    const events = vacations
        .filter(v => filter === "all" || v.employee_id == filter)
        .map(v => {
            const emp = employees.find(e => e.id == v.employee_id);
            return {
                title: emp ? emp.name : "Okänd",
                start: v.start,
                end: v.end
            };
        });

    if (calendar) {
        calendar.destroy();
    }

    const calendarEl = document.getElementById("calendar");

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        events: events
    });

    calendar.render();
}

// ==========================================
// 🚀 INIT
// ==========================================

window.onload = () => {
    loadEmployees();
    renderCalendar();
};
