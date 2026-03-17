/*
==========================================
AUTH SYSTEM (ENKEL / SYMBOLISK)
==========================================
*/

// Hämta användare
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Spara användare
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// 🔐 REGISTRERA
function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) return;

    let users = getUsers();

    if (users.find(u => u.username === username)) {
        document.getElementById("message").innerText = "Användare finns redan!";
        return;
    }

    users.push({ username, password });
    saveUsers(users);

    document.getElementById("message").innerText = "Konto skapat!";
}

// 🔐 LOGIN
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let users = getUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        document.getElementById("message").innerText = "Fel login!";
        return;
    }

    // Spara session
    localStorage.setItem("currentUser", username);

    window.location.href = "index.html";
}
