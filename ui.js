/* ==========================================
   🪟 MODAL HANDLING (PRODUCTION SAFE)
========================================== */

window.openModal = function(id) {
    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) return;

    modal.classList.add("active");
    overlay.style.display = "block";

    // 🔥 KRITISK FIX – stäng av kalendern
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "none";
    }
};

window.closeModal = function() {
    const modals = document.querySelectorAll(".modal");
    const overlay = document.getElementById("modalOverlay");

    modals.forEach(m => m.classList.remove("active"));

    if (overlay) {
        overlay.style.display = "none";
    }

    // 🔥 återaktivera kalendern
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "auto";
    }
};
