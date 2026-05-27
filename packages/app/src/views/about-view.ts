export class AboutViewElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <main class="page-shell">
        <div class="page-main">
          <section>
            <h2>About This App</h2>
            <p>
              This app is a student-focused to-do list for keeping track of
              school assignments, personal tasks, due dates, and completed
              work. It is built as a TypeScript single-page app with Vite,
              client-side routing, authentication, and REST-backed task data.
            </p>
            <p>
              The app uses MVU state management: views dispatch typed task
              messages, the update function performs API requests, and the
              store keeps the task model in one shared place.
            </p>
            <p>
              <a href="/app">Back to home</a>
            </p>
          </section>

          <section>
            <h2>Course Lab Progression</h2>
            <p>
              This project grew through the CSC 437 lab sequence: first as
              semantic HTML and CSS, then as a server-backed app, and now as a
              routed TypeScript SPA using MVU state management.
            </p>
            <ol class="lab-list">
              <li>
                <strong>Lab 1. Information Architecture in Miro</strong>
                <span>Planned the structure and content for the app.</span>
              </li>
              <li>
                <strong>Lab 2. Authoring HTML</strong>
                <span>Built the first semantic HTML version of the pages.</span>
              </li>
              <li>
                <strong>Lab 3. Colors and Design Tokens</strong>
                <span>Added reusable colors and visual design tokens.</span>
              </li>
              <li>
                <strong>Lab 4. Typography and Icons</strong>
                <span>Improved readability and added icon styling.</span>
              </li>
              <li>
                <strong>Lab 5. CSS Layout</strong>
                <span>Organized the page with responsive CSS layout.</span>
              </li>
              <li>
                <strong>Lab 6. Deployment</strong>
                <span>Prepared the app to run outside the local machine.</span>
              </li>
              <li>
                <strong>Lab 7. Dark Mode Switch</strong>
                <span>Added a theme toggle shared across pages.</span>
              </li>
              <li>
                <strong>Lab 8. Custom View Element</strong>
                <span>Moved page rendering into custom elements.</span>
              </li>
              <li>
                <strong>Lab 9. Client-side Rendering</strong>
                <span>Rendered task data in the browser with JavaScript.</span>
              </li>
              <li>
                <strong>Lab 10. Express Server</strong>
                <span>Created backend routes for app data.</span>
              </li>
              <li>
                <strong>Lab 11. Persist Data in a Database</strong>
                <span>Stored task data so it survives page reloads.</span>
              </li>
              <li>
                <strong>Lab 12. Secure ReST APIs</strong>
                <span>Protected API requests behind authentication.</span>
              </li>
              <li>
                <strong>Lab 13. User Login and Authentication</strong>
                <span>Added login, sign out, and authenticated data access.</span>
              </li>
              <li class="current-lab">
                <strong>Lab 14. Client-side Routing</strong>
                <span>Turned the app into a Vite SPA with routed views.</span>
              </li>
              <li class="current-lab">
                <strong>Lab 15. MVU and State Management</strong>
                <span>Moved shared task state into a typed store provider.</span>
              </li>
              <li class="current-lab">
                <strong>Lab 16. Forms with MVU and Messages</strong>
                <span>Made add, edit, complete, and delete flow through MVU messages.</span>
              </li>
            </ol>
          </section>
        </div>

        <aside class="page-sidebar">
          <section class="sidebar-card">
            <h2>Current Turn-In</h2>
            <div class="meta-list">
              <div class="meta-row">
                <strong>Lab 14</strong>
                <span>SPA routing</span>
              </div>
              <div class="meta-row">
                <strong>Lab 15</strong>
                <span>MVU store</span>
              </div>
              <div class="meta-row">
                <strong>Lab 16</strong>
                <span>MVU forms</span>
              </div>
            </div>
          </section>
        </aside>
      </main>
    `;
  }
}
