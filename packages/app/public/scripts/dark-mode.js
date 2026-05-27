document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const savedMode = localStorage.getItem("darkMode");

  function setDarkMode(checked) {
    if (checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }

    document
      .querySelectorAll(".dark-mode-toggle input")
      .forEach((input) => {
        input.checked = checked;
      });
  }

  setDarkMode(savedMode === "true");

  document.addEventListener("change", (event) => {
    const input = event.target;

    if (
      !(input instanceof HTMLInputElement) ||
      !input.closest(".dark-mode-toggle")
    ) {
      return;
    }

    setDarkMode(input.checked);
  });
});
