export class AppHeaderElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const token =
      localStorage.getItem("un-auth:token") || localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const navLinks = token
      ? [
          { href: "/app", label: "Home" },
          { href: "/app/completed", label: "Completed" }
        ]
      : [
          { href: "/app", label: "Home" },
          { href: "/app/about", label: "About" }
        ];

    this.innerHTML = `
      <header class="site-header">
        <div class="site-brand">
          <p class="site-kicker">Task Manager</p>
          <h1>My To-Do List</h1>
        </div>

        <div class="site-header-right">
          <nav class="site-nav" aria-label="Primary">
            <ul>
              ${navLinks
                .map(
                  (link) => `
                    <li>
                      <a href="${link.href}" ${isCurrentLink(link.href) ? 'aria-current="page"' : ""}>
                        ${link.label}
                      </a>
                    </li>
                  `
                )
                .join("")}
            </ul>
          </nav>

          <details class="settings-menu">
            <summary>Settings</summary>
            <div class="settings-panel">
              <p class="site-user">
                ${token ? `Signed in as ${username || "user"}` : "Not signed in"}
              </p>
              <label class="dark-mode-toggle">
                <input
                  type="checkbox"
                  autocomplete="off"
                  ${localStorage.getItem("darkMode") === "true" ? "checked" : ""}
                />
                <span class="theme-switch-track" aria-hidden="true"></span>
                <span class="theme-switch-text">Dark mode</span>
              </label>
              ${
                token
                  ? '<button id="signout-button" type="button">Sign Out</button>'
                  : '<a class="settings-link" href="/login.html" id="signin-link">Sign In</a>'
              }
            </div>
          </details>
        </div>
      </header>
    `;

    const signoutButton = this.querySelector("#signout-button");

    signoutButton?.addEventListener("click", () => {
      localStorage.removeItem("un-auth:token");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login.html";
    });
  }
}

function isCurrentLink(href: string) {
  const current = `${window.location.pathname}${window.location.search}`;

  if (href === "/app") {
    return window.location.pathname === "/app" && !window.location.search;
  }

  return current === href;
}
