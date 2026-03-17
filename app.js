// 🔐 AUTH
function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

if (!getCurrentUser()) {
    window.location.href = "login.html";
}

// DATA
function getEmployees() {
    return JSON.parse(localStorage.getItem(getCurrentUser()+"_employees")) || [];
}

function saveEmployees(data) {
    localStorage.setItem(getCurrentUser()+"_employees", JSON.stringify(data));
}

function getVacations() {
    return JSON.parse(localStorage.getItem(getCurrentUser()+"_vacations")) || [];
}

function saveVacations(data) {
    localStorage.setItem(getCurrentUser()+"_vacations", JSON.stringify(data));
}

// MODAL
function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal() {
    document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}

// PERSONAL
function addEmployee() {
    let name = document.getElementById("employeeName").value;
    if (!name) return;

    let employees = getEmployees();
    employees.push({ id: Date.now(), name });

    saveEmployees(employees);
    loadEmployees();
}

// SEMESTER
function addVacation() {
    let empId = document.getElementById("employeeSelect").value;
    let start = document.getElementById("startDate").value;
    let end = document.getElementById("endDate").value;

    let vacations = getVacations();

    const overlap = vacations.filter(v => start <= v.end && end >= v.start);

    if (overlap.length >= 3) {
        document.getElementById("warning").innerText = "För många lediga!";
        return;
    }

    vacations.push({
        id: Date.now(),
        employee_id: empId,
        start,
        end
    });

    saveVacations(vacations);
    renderCalendar();
}

// UI
function loadEmployees() {
    const employees = getEmployees();
    const select = document.getElementById("employeeSelect");
    const filter = document.getElementById("filter");

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
    const filter = document.getElementById("filter").value;

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

    calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
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
}

// INIT
window.onload = () => {
    loadEmployees();
    renderCalendar();
};
