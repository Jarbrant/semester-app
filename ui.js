const modal = document.getElementById("modal");

export function openModal(html) {
  modal.innerHTML = `<div class="modal-box">${html}</div>`;
  modal.classList.add("open");
}

export function closeModal() {
  modal.classList.remove("open");
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
