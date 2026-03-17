import { getEmployees, saveEmployees } from "./data.js";
import { openModal, closeModal } from "./ui.js";

let employees = [];

export function initEmployees() {
  employees = getEmployees();
  renderEmployees();
}

export function addEmployee(name, phone = "") {
  const newEmployee = {
    id: Date.now(),
    name,
    phone,
    color: getColor(employees.length)
  };

  employees.push(newEmployee);
  saveEmployees(employees);
  renderEmployees();
}

export function deleteEmployee(id) {
  employees = employees.filter(e => e.id !== id);
  saveEmployees(employees);
  renderEmployees();
}

export function updateEmployee(id, name, phone) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  emp.name = name;
  emp.phone = phone;

  saveEmployees(employees);
  renderEmployees();
  closeModal();
}

function getColor(index) {
  const colors = ["#22c55e", "#3b82f6", "#f97316", "#e11d48"];
  return colors[index % colors.length];
}

export function renderEmployees() {
  const list = document.getElementById("employee-list");
  list.innerHTML = "";

  employees = getEmployees();

  employees.forEach(emp => {
    const item = document.createElement("div");
    item.className = "employee-item";

    item.innerHTML = `
      <div class="employee-info" data-id="${emp.id}">
        <div class="employee-color" style="background:${emp.color}"></div>
        <div>
          <div class="employee-name">${emp.name}</div>
          <div class="employee-phone">${emp.phone || "-"}</div>
        </div>
      </div>
      <button class="delete-btn" data-id="${emp.id}">❌</button>
    `;

    list.appendChild(item);
  });

  // CLICK → EDIT
  document.querySelectorAll(".employee-info").forEach(el => {
    el.addEventListener("click", () => {
      const id = Number(el.dataset.id);
      openEditModal(id);
    });
  });

  // DELETE
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteEmployee(Number(btn.dataset.id));
    });
  });
}

function openEditModal(id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  openModal(`
    <h2>Edit Employee</h2>

    <input id="edit-name" value="${emp.name}" />
    <input id="edit-phone" value="${emp.phone || ""}" />

    <div class="modal-actions">
      <button id="save-edit">Save</button>
      <button id="cancel-edit">Cancel</button>
    </div>
  `);

  document.getElementById("save-edit").addEventListener("click", () => {
    const name = document.getElementById("edit-name").value;
    const phone = document.getElementById("edit-phone").value;

    if (!name) return;

    updateEmployee(id, name, phone);
  });

  document.getElementById("cancel-edit").addEventListener("click", closeModal);
}
