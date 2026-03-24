/* ==========================================
   🔐 AUTH SYSTEM (SEMI PRO)
========================================== */

window.login = function (username, password) {

    const employees = getEmployees();

    const user = employees.find(e =>
        e.login?.username === username &&
        e.login?.password === password
    );

    if (!user) {
        alert("Fel användarnamn eller lösenord");
        return false;
    }

    localStorage.setItem("currentUser", user.id);

    return true;
};

window.logout = function () {
    localStorage.removeItem("currentUser");
    location.reload();
};

window.getCurrentUser = function () {
    const id = localStorage.getItem("currentUser");
    return getEmployees().find(e => e.id == id);
};

window.isAdmin = function () {
    const user = getCurrentUser();
    return user?.login?.role === "admin";
};
