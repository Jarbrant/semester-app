/* ==========================================
   🪟 MODAL HANDLING (FIXED FOR NEW CSS)
========================================== */

window.openModal = function(id) {
    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) return;

    modal.classList.add("active");   // 🔥 ändrad
    overlay.style.display = "block"; // 🔥 visa overlay
};

window.closeModal = function() {
    const modals = document.querySelectorAll(".modal");
    const overlay = document.getElementById("modalOverlay");

    modals.forEach(m => m.classList.remove("active")); // 🔥 ändrad

    if (overlay) {
        overlay.style.display = "none";
    }
};
