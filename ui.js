/* ==========================================
   🪟 UI / MODALS
========================================== */

window.openModal = function(id) {
    document.getElementById(id)?.classList.add("show");
};

window.closeModal = function() {
    document.querySelectorAll(".modal")
        .forEach(m => m.classList.remove("show"));
};

// 🔥 Klick utanför = stäng
window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach(m => {
        if (e.target === m) m.classList.remove("show");
    });
});

// 🔥 ESC = stäng
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});
