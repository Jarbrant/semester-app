// ui.js
// Ansvar: Hantera modals (open/close + ESC + overlay click)

let modal = null;

export function initModal() {
  modal = document.getElementById("modal");

  // Klick utanför = stäng
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC = stäng
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

export function openModal(contentHTML) {
  modal.innerHTML = `
    <div class="modal-content">
      ${contentHTML}
    </div>
  `;
  modal.classList.add("open");
}

export function closeModal() {
  modal.classList.remove("open");
  modal.innerHTML = "";
}
