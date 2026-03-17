import { getEmployees, saveEmployees } from "./data.js";

export function addEmployee(name) {
  const data = getEmployees();

  data.push({
    id: Date.now(),
    name
  });

  saveEmployees(data);
}

export function deleteEmployee(id) {
  const data = getEmployees().filter(e => e.id !== id);
  saveEmployees(data);
}

export function getAllEmployees() {
  return getEmployees();
}
