export class AboutViewElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <main class="page-shell">
        <div class="page-main">
          <section>
            <h2>About This App</h2>
            <p>
              This is a single-page version of my to-do list prototype.
              It uses client-side routing, so navigating between views does not reload the page.
            </p>
            <p>
              <a href="/app">Back to home</a>
            </p>
          </section>
        </div>

        <aside class="page-sidebar">
          <section class="sidebar-card">
            <h2>SPA Lab</h2>
            <p>Lab 14 uses Vite, client-side routing, and protected API data.</p>
          </section>
        </aside>
      </main>
    `;
  }
}