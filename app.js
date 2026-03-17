// ===============================
// 🔐 AUTH
// ===============================

function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// Kör auth endast på index
if (!getCurrentUser() && window.location.pathname.includes("index")) {
    window.location.href = "login.html";
}

// ===============================
// 💾 DATA
// ===============================

function getEmployees() {
    return JSON.parse(localStorage.getItem(getCurrentUser() + "_employees")) || [];
}

function saveEmployees(data) {
    localStorage.setItem(getCurrentUser() + "_employees", JSON.stringify(data));
}

function getVacations() {
    return JSON.parse(localStorage.getItem(getCurrentUser() + "_vacations")) || [];
}

function saveVacations(data) {
    localStorage.setItem(getCurrentUser() + "_vacations", JSON.stringify(data));
}

// ===============================
// 🪟 MODALS (GLOBAL SAFE)
// ===============================

window.openModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
};

window.closeModal = function() {
    document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
};

// ===============================
// 👥 PERSONAL
// ===============================

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

// ===============================
// 📅 SEMESTER
// ===============================

window.addVacation = function() {
    const empId = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;

    if (!empId || !start || !end) return;

    let vacations = getVacations();

    const overlap = vacations.filter(v => start <= v.end && end >= v.start);

    if (overlap.length >= 3) {
        const warn = document.getElementById("warning");
        if (warn) warn.innerText = "För många lediga!";
        return;
    }

    const warn = document.getElementById("warning");
    if (warn) warn.innerText = "";

    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start,
        end
    });

    saveVacations(vacations);
    renderCalendar();
};

// ===============================
// 🔹 UI
// ===============================

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

// ===============================
// 📅 KALENDER
// ===============================

let calendar;

function renderCalendar() {
    const employees = getEmployees();
    const vacations = getVacations();

    const filterEl = document.getElementById("filter");
    const filter = filterEl ? filterEl.value : "all";

    const events = vacations
        .filter(v => filter === "all" || v.employee_id == filter)
        .map(v => {
            const emp = employees.find(e => e.id == v.employee_id);
            return {
                id: v.id,
                title: emp ? emp.name : "?",
                start: v.start,
                end: v.end
            };
        });

    if (calendar) calendar.destroy();

    const calEl = document.getElementById("calendar");
    if (!calEl) return;

    calendar = new FullCalendar.Calendar(calEl, {
        initialView: "dayGridMonth",
        events: events,
        eventClick: function(info) {
            if (confirm("Ta bort?")) {
                let vac = getVacations().filter(v => v.id != info.event.id);
                saveVacations(vac);
                renderCalendar();
            }
        }
    });

    calendar.render();
    renderVacationList();
}

// ===============================
// 📋 LISTA
// ===============================

function renderVacationList() {
    const employees = getEmployees();
    const vacations = getVacations();
    const list = document.getElementById("vacationList");

    if (!list) return;

    list.innerHTML = "";

    vacations.forEach(v => {
        const emp = employees.find(e => e.id == v.employee_id);

        list.innerHTML += `
            <li>
                ${emp ? emp.name : "?"}: ${v.start} → ${v.end}
            </li>
        `;
    });
}

// ===============================
// 🚀 INIT (SÄKER)
// ===============================

window.addEventListener("DOMContentLoaded", () => {
    loadEmployees();
    renderCalendar();
});
