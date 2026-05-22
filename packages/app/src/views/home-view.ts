export class HomeViewElement extends HTMLElement {
  connectedCallback() {
    this.render();
    this.loadTasks();
  }

  render() {
    this.innerHTML = `
      <main class="page-shell">
        <div class="page-main">
          <section class="section-card">
            <div class="section-card-icon">
              <svg class="icon">
                <use href="/icons/status.svg#icon-tasks"></use>
              </svg>
            </div>

            <div class="section-card-content">
              <h2>Tasks</h2>
              <hr />
              <div id="task-list">Loading tasks...</div>
            </div>
          </section>

          <section class="section-card">
            <div class="section-card-icon">
              <svg class="icon">
                <use href="/icons/status.svg#icon-category"></use>
              </svg>
            </div>

            <div class="section-card-content">
              <h2>Categories</h2>
              <hr />
              <ul>
                <li>School</li>
                <li>Personal</li>
              </ul>
            </div>
          </section>

          <section class="section-card">
            <div class="section-card-icon">
              <svg class="icon">
                <use href="/icons/status.svg#icon-status"></use>
              </svg>
            </div>

            <div class="section-card-content">
              <h2>Statuses</h2>
              <hr />
              <ul>
                <li>Pending</li>
                <li>Completed</li>
              </ul>
            </div>
          </section>
        </div>

        <aside class="page-sidebar">
          <section class="sidebar-card">
            <h2>Overview</h2>
            <p>
              This SPA loads task data from the protected Express API.
            </p>
          </section>

          <section class="sidebar-card">
            <h2>Navigation</h2>
            <ul class="link-stack">
              <li><a href="/app">Home view</a></li>
              <li><a href="/app/about">About view</a></li>
            </ul>
          </section>
        </aside>
      </main>
    `;
  }

  loadTasks() {
    const taskList = this.querySelector("#task-list");
    const token = localStorage.getItem("token");

    fetch("/api/tasks", {
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Please log in to view tasks.");
        }

        return response.json();
      })
      .then((data) => {
        const tasks = data.tasks || [];

        if (!tasks.length) {
          taskList!.innerHTML = "<p>No tasks found.</p>";
          return;
        }

        taskList!.innerHTML = `
          <ul>
            ${tasks
              .map(
                (task: any) => `
                  <li>
                    <strong>${task.name}</strong>
                    <br />
                    Status: ${task.status}
                    <br />
                    Category: ${task.category}
                    <br />
                    Due: ${task.dueDate}
                  </li>
                `
              )
              .join("")}
          </ul>
        `;
      })
      .catch((error) => {
        taskList!.innerHTML = `<p>${error.message}</p>`;
      });
  }
}