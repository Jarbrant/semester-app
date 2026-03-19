/* ==========================================
   🪟 MODAL + DATE INPUT FIX
========================================== */

window.openModal = function(id) {
    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) return;

    modal.classList.add("active");
    overlay.style.display = "block";

    // 🔥 stäng av kalendern
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "none";
    }
};

window.closeModal = function() {
    const modals = document.querySelectorAll(".modal");
    const overlay = document.getElementById("modalOverlay");

    modals.forEach(m => m.classList.remove("active"));

    if (overlay) overlay.style.display = "none";

    // 🔥 återaktivera kalendern
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "auto";
    }
};

/* ==========================================
   📅 SIMPLE DATE HANDLING
========================================== */

// klick på input → fyll dagens datum om tomt
document.addEventListener("click", (e) => {
    if (e.target.id === "startDate" || e.target.id === "endDate") {
        if (!e.target.value) {
            const today = new Date().toISOString().split("T")[0];
            e.target.value = today;
        }
    }
});
