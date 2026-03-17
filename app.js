import { addEmployee, getAllEmployees } from "./employees.js";
import { addVacation, getAllVacations } from "./vacations.js";
import { renderCalendar } from "./calendar.js";
import { openModal, closeModal } from "./ui.js";

function init() {
  setupButtons();
  renderAll();
}

function setupButtons() {

  document.getElementById("add-employee-btn").onclick = () => {
    openModal(`
      <input id="name" placeholder="Namn">
      <button id="save">Spara</button>
    `);

    document.getElementById("save").onclick = () => {
      addEmployee(document.getElementById("name").value);
      closeModal();
      renderAll();
    };
  };

  document.getElementById("add-vacation-btn").onclick = () => {
    const employees = getAllEmployees();

    openModal(`
      <select id="emp">
        ${employees.map(e => `<option value="${e.id}">${e.name}</option>`).join("")}
      </select>
      <input type="date" id="start">
      <input type="date" id="end">
      <button id="save">Spara</button>
    `);

    document.getElementById("save").onclick = () => {
      addVacation({
        id: Date.now(),
        employeeId: document.getElementById("emp").value,
        start: document.getElementById("start").value,
        end: document.getElementById("end").value
      });

      closeModal();
      renderAll();
    };
  };

  document.getElementById("employee-filter").onchange = (e) => {
    renderCalendar(e.target.value);
  };
}

function renderAll() {
  const employees = getAllEmployees();

  const filter = document.getElementById("employee-filter");
  filter.innerHTML = `<option value="">Alla</option>` +
    employees.map(e => `<option value="${e.id}">${e.name}</option>`).join("");

  renderCalendar();
}

init();
