/*
==========================================
VERSION 2 - MER FUNKTIONER
==========================================
*/

// ==========================================
// 🔹 DATA
// ==========================================

function getEmployees() {
    return JSON.parse(localStorage.getItem("employees")) || [];
}

function getVacations() {
    return JSON.parse(localStorage.getItem("vacations")) || [];
}

// ==========================================
// 👥 PERSONAL
// ==========================================

function addEmployee() {
    const name = document.getElementById("employeeName").value;
    if (!name) return;

    let employees = getEmployees();

    employees.push({
        id: Date.now(),
        name
    });

    localStorage.setItem("employees", JSON.stringify(employees));

    document.getElementById("employeeName").value = "";

    loadEmployees();
    renderCalendar();
}

function deleteEmployee(id) {
    let employees = getEmployees().filter(e => e.id != id);
    localStorage.setItem("employees", JSON.stringify(employees));

    loadEmployees();
    renderCalendar();
}

// ==========================================
// 📅 SEMESTER
// ==========================================

function addVacation() {
    const empId = document.getElementById("employeeSelect").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if (!empId || !start || !end) return;

    let vacations = getVacations();

    // ⚠️ Konfliktregel (max 3 personer)
    const overlap = vacations.filter(v =>
        (start <= v.end && end >= v.start)
    );

    if (overlap.length >= 3) {
        document.getElementById("warning").innerText =
            "⚠️ För många är redan lediga denna period!";
        return;
    }

    document.getElementById("warning").innerText = "";

    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start,
        end
    });

    localStorage.setItem("vacations", JSON.stringify(vacations));

    renderCalendar();
}

function deleteVacation(id) {
    let vacations = getVacations().filter(v => v.id != id);
    localStorage.setItem("vacations", JSON.stringify(vacations));
    renderCalendar();
}

// ==========================================
// 🔹 UI LADDNING
// ==========================================

function loadEmployees() {
    const employees = getEmployees();

    const select = document.getElementById("employeeSelect");
    const filter = document.getElementById("filter");
    const list = document.getElementById("employeeList");

    select.innerHTML = "";
    filter.innerHTML = '<option value="all">Visa alla</option>';
    list.innerHTML = "";

    employees.forEach(emp => {
        select.innerHTML += `<option value="${emp.id}">${emp.name}</option>`;
        filter.innerHTML += `<option value="${emp.id}">${emp.name}</option>`;

        list.innerHTML += `
            <li>
                ${emp.name}
                <button onclick="deleteEmployee(${emp.id})">❌</button>
            </li>
        `;
    });
}

// ==========================================
// 📅 KALENDER
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
                id: v.id,
                title: emp ? emp.name : "Okänd",
                start: v.start,
                end: v.end
            };
        });

    if (calendar) calendar.destroy();

    calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
        initialView: "dayGridMonth",
        events: events,

        // 🗑️ Klicka för att ta bort
        eventClick: function(info) {
            if (confirm("Ta bort denna semester?")) {
                deleteVacation(info.event.id);
            }
        }
    });

    calendar.render();

    renderVacationList();
}

// ==========================================
// 📋 LISTA
// ==========================================

function renderVacationList() {
    const employees = getEmployees();
    const vacations = getVacations();
    const list = document.getElementById("vacationList");

    list.innerHTML = "";

    vacations.forEach(v => {
        const emp = employees.find(e => e.id == v.employee_id);

        list.innerHTML += `
            <li>
                ${emp ? emp.name : "?"}:
                ${v.start} → ${v.end}
                <button onclick="deleteVacation(${v.id})">❌</button>
            </li>
        `;
    });
}

// ==========================================
// 🚀 INIT
// ==========================================

window.onload = () => {
    loadEmployees();
    renderCalendar();
};
