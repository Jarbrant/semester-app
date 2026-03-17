const user = localStorage.getItem("user") || "default";

function key(name) {
  return `${user}_${name}`;
}

export function getEmployees() {
  return JSON.parse(localStorage.getItem(key("employees"))) || [];
}

export function saveEmployees(data) {
  localStorage.setItem(key("employees"), JSON.stringify(data));
}

export function getVacations() {
  return JSON.parse(localStorage.getItem(key("vacations"))) || [];
}

export function saveVacations(data) {
  localStorage.setItem(key("vacations"), JSON.stringify(data));
}
