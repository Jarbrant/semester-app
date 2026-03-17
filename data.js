// data.js
// Ansvar: Hantera all localStorage (employees + vacations)
// Skalbar struktur så du kan bygga vidare senare

const KEYS = {
  employees: "employees",
  vacations: "vacations"
};

// ===== EMPLOYEES =====

export function getEmployees() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.employees)) || [];
  } catch (error) {
    console.error("Error reading employees:", error);
    return [];
  }
}

export function saveEmployees(employees) {
  try {
    localStorage.setItem(KEYS.employees, JSON.stringify(employees));
  } catch (error) {
    console.error("Error saving employees:", error);
  }
}

// ===== VACATIONS =====

export function getVacations() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.vacations)) || [];
  } catch (error) {
    console.error("Error reading vacations:", error);
    return [];
  }
}

export function saveVacations(vacations) {
  try {
    localStorage.setItem(KEYS.vacations, JSON.stringify(vacations));
  } catch (error) {
    console.error("Error saving vacations:", error);
  }
}

// ===== GENERIC HELPERS (framtidssäkert) =====

// Rensa all data (bra för debug)
export function clearAllData() {
  localStorage.removeItem(KEYS.employees);
  localStorage.removeItem(KEYS.vacations);
}

// Reset med tomma arrays (om du vill initiera)
export function initializeStorage() {
  if (!localStorage.getItem(KEYS.employees)) {
    saveEmployees([]);
  }

  if (!localStorage.getItem(KEYS.vacations)) {
    saveVacations([]);
  }
}
