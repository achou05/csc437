const form = document.querySelector("#login-form");
const errorMessage = document.querySelector("#login-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const loginData = {
    username: formData.get("username"),
    password: formData.get("password")
  };

  fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData)
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Login failed");
      }

      return response.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", loginData.username);
      window.location.href = "/";
    })
    .catch((error) => {
      errorMessage.textContent = error.message;
    });
});