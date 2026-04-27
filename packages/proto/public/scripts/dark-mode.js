document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggleLabel = document.querySelector(".dark-mode-toggle");
  const toggleInput = toggleLabel?.querySelector("input");

  if (!toggleLabel || !toggleInput) return;

  toggleLabel.onchange = (event) => {
    const checked = event.target.checked;

    const darkModeEvent = new CustomEvent("darkmode:toggle", {
      bubbles: true,
      detail: { checked }
    });

    event.stopPropagation();
    toggleLabel.dispatchEvent(darkModeEvent);
  };

  body.addEventListener("darkmode:toggle", (event) => {
    if (event.detail.checked) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  });
});