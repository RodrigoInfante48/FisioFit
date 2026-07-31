// FisioFit — punto de entrada. Lógica de botones y figura muscular pendiente.

const movementMenu = document.querySelector(".movement-menu");
let selectedGroup = null;

movementMenu.addEventListener("click", (event) => {
  const button = event.target.closest(".glass-btn[data-movement]");
  if (!button) return;

  const group = button.dataset.movement;
  selectedGroup = selectedGroup === group ? null : group;

  movementMenu.querySelectorAll(".glass-btn").forEach((btn) => {
    const isSelected = btn.dataset.movement === selectedGroup;
    btn.classList.toggle("is-selected", isSelected);
    btn.setAttribute("aria-pressed", String(isSelected));
  });

  const workoutGroupChanged = new CustomEvent("workoutGroupChanged", {
    detail: { group: selectedGroup },
  });
  document.dispatchEvent(workoutGroupChanged);
  console.log("workoutGroupChanged", workoutGroupChanged.detail);
});
