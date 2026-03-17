// ----- Enkel användarhantering via localStorage -----
function getUserKey() {
  return 'vacationApp_' + (localStorage.getItem('loggedInUser') || '');
}
function saveData(data) {
  localStorage.setItem(getUserKey(), JSON.stringify(data));
}
function loadData() {
  return JSON.parse(localStorage.getItem(getUserKey()) || '{"employees":[],"vacations":[]}');
}

// ----- Enkel login/utloggning -----
const loginModal = document.getElementById('login-modal');
const appDiv = document.getElementById('app');
document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  const uname = document.getElementById('username').value.trim();
  if (uname) {
    localStorage.setItem('loggedInUser', uname);
    if (!localStorage.getItem(getUserKey())) saveData({employees:[], vacations:[]});
    showApp();
  }
};
document.getElementById('logout-btn').onclick = function() {
  localStorage.removeItem('loggedInUser');
  location.reload();
};
function showApp() {
  loginModal.style.display = 'none';
  appDiv.classList.remove('hidden');
  renderAll();
}
if (localStorage.getItem('loggedInUser')) showApp();

// ----- Enkel UI-uppriggning (visa/lista personal & semestrar, mall) -----
function renderEmployeeList() {
  const data = loadData();
  const ul = document.getElementById('employee-list');
  ul.innerHTML = '';
  data.employees.forEach(emp => {
    const li = document.createElement('li');
    li.textContent = emp.name + ' (ID: ' + emp.id + ')';
    li.innerHTML += `<button onclick="removeEmployee('${emp.id}')">Ta bort</button>`;
    ul.appendChild(li);
  });
}
window.removeEmployee = function(id) {
  let data = loadData();
  data.employees = data.employees.filter(emp => emp.id !== id);
  data.vacations = data.vacations.filter(vac => vac.employeeId !== id);
  saveData(data);
  renderAll();
};

document.getElementById('add-employee-btn').onclick = function() {
  const name = prompt('Anställds namn:');
  if (name) {
    let data = loadData();
    const id = Math.random().toString(36).substr(2, 8);
    data.employees.push({ name, id });
    saveData(data);
    renderAll();
  }
};

// Liknande funktion för semestrar... (lägg till, ta bort, visa)
function renderVacationList() {
  const data = loadData();
  const ul = document.getElementById('vacation-list');
  ul.innerHTML = '';
  data.vacations.forEach(vac => {
    const emp = data.employees.find(e => e.id === vac.employeeId);
    if (emp) {
      const li = document.createElement('li');
      li.textContent = `${emp.name}: ${vac.start} – ${vac.end}`;
      li.innerHTML += `<button onclick="removeVacation('${vac.id}')">Ta bort</button>`;
      ul.appendChild(li);
    }
  });
}
window.removeVacation = function(id) {
  let data = loadData();
  data.vacations = data.vacations.filter(vac => vac.id !== id);
  saveData(data);
  renderAll();
};
document.getElementById('add-vacation-btn').onclick = function() {
  // Enkel mall med prompt; byt gärna mot snygg modal!
  let data = loadData();
  const employees = data.employees;
  if (employees.length === 0) return alert('Lägg till personal först!');
  const empId = prompt('Ange ID för anställd:');
  if (!empId || !employees.some(e => e.id === empId)) return;
  const start = prompt('Startdatum (YYYY-MM-DD):');
  const end = prompt('Slutdatum (YYYY-MM-DD):');
  if (start && end) {
    // Här borde koll mot max antal lediga ske!
    const id = Math.random().toString(36).substr(2, 8);
    data.vacations.push({ id, employeeId: empId, start, end });
    saveData(data);
    renderAll();
  }
};

// Hämta ut alla semestrar för kalendern, bygg renderfunktion
function renderAll() {
  renderEmployeeList();
  renderVacationList();
  // TODO: renderCalendarView osv.
}

// Init-bestämmelse
if (localStorage.getItem('loggedInUser')) renderAll();
