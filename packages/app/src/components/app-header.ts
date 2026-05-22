export class AppHeaderElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    this.innerHTML = `
      <header class="site-header">
        <div class="site-brand">
          <p class="site-kicker">Task Prototype</p>
          <h1>My To-Do List</h1>
        </div>

        <div class="site-header-right">
          <nav class="site-nav" aria-label="Primary">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/about">About</a></li>
            </ul>
          </nav>

          ${
            token
              ? `<button id="signout-button" type="button">Sign Out</button>
                 <p class="site-user">Signed in as ${username || "user"}</p>`
              : `<a href="/login.html" id="signin-link">Sign In</a>
                 <p class="site-user">Not signed in</p>`
          }
        </div>
      </header>
    `;

    const signoutButton = this.querySelector("#signout-button");

    signoutButton?.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login.html";
    });
  }
}