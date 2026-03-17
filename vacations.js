import { getVacations, saveVacations } from "./data.js";

export function addVacation(v) {
  const data = getVacations();
  data.push(v);
  saveVacations(data);
}

export function deleteVacation(id) {
  const data = getVacations().filter(v => v.id !== id);
  saveVacations(data);
}

export function getAllVacations() {
  return getVacations();
}
