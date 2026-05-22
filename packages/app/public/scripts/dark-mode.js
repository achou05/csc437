document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggleLabel = document.querySelector(".dark-mode-toggle");
  const toggleInput = toggleLabel?.querySelector("input");

  if (!toggleLabel || !toggleInput) return;

  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "true") {
    body.classList.add("dark-mode");
    toggleInput.checked = true;
  }

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
      localStorage.setItem("darkMode", "true");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  });
});