const signinLink = document.querySelector("#signin-link");
const signoutButton = document.querySelector("#signout-button");
const siteUser = document.querySelector("#site-user");

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (signinLink && signoutButton && siteUser) {
  if (token) {
    signinLink.style.display = "none";
    signoutButton.style.display = "inline-block";
    siteUser.textContent = username ? `Signed in as ${username}` : "Signed in";
  } else {
    signinLink.style.display = "inline-block";
    signoutButton.style.display = "none";
    siteUser.textContent = "Not signed in";
  }

  signoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login.html";
  });
}