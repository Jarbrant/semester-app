function getEmployees() {
    return JSON.parse(localStorage.getItem("employees")) || [];
}

function saveEmployees(data) {
    localStorage.setItem("employees", JSON.stringify(data));
}

function getVacations() {
    return JSON.parse(localStorage.getItem("vacations")) || [];
}

function saveVacations(data) {
    localStorage.setItem("vacations", JSON.stringify(data));
}
