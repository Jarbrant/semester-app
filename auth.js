/* ==========================================
   🔐 AUTH (ENKEL ROLLHANTERING)
========================================== */

// 🔹 Hämta användare
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// 🔹 Logga in (demo)
window.login = function(name, role) {
    localStorage.setItem("user", JSON.stringify({ name, role }));
};

// 🔹 Logga ut
window.logout = function() {
    localStorage.removeItem("user");
    location.reload();
};

// 🔹 Kolla admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}
