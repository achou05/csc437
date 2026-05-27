import { Store, fromStore } from "@unbndl/store";
import { createViewModel } from "@unbndl/view";
import type { Task } from "server/models";
import type { TaskFormElement } from "../components/task-form.ts";
import type { ActionStatus, LoadStatus, Model } from "../model.ts";
import type { Msg, TaskReactions } from "../messages.ts";

interface HomeViewModel {
  tasks?: Task[];
  tasksStatus: LoadStatus;
  actionStatus: ActionStatus;
  editingTaskId?: string;
  error?: string;
  actionError?: string;
}

type TaskFilter = "all" | "pending" | "completed";

export class HomeViewElement extends HTMLElement {
  private hasRequestedTasks = false;

  viewModel = createViewModel<HomeViewModel>({
    tasksStatus: "idle",
    actionStatus: "idle"
  }).with(
    fromStore<Model>(this),
    "tasks",
    "tasksStatus",
    "actionStatus",
    "editingTaskId",
    "error",
    "actionError"
  );

  constructor() {
    super();

    this.viewModel.createEffect(($) => {
      this.render($);
    });
  }

  connectedCallback() {
    if (!this.hasRequestedTasks) {
      Store.dispatch<Msg>(this, ["tasks/request", {}]);
      this.hasRequestedTasks = true;
    }
  }

  render($: HomeViewModel) {
    const completedPage = isCompletedRoute();
    const filter = getTaskFilter();
    const editingTask =
      completedPage
        ? undefined
        : $.tasks?.find((task) => task.id === $.editingTaskId);
    const filteredTasks = filterTasks($.tasks, filter);
    const title = completedPage ? "Completed" : "Tasks";

    this.innerHTML = `
      <main class="page-shell todo-shell">
        <div class="page-main">
          <section class="section-card">
            <div class="section-card-icon">
              <svg class="icon">
                <use href="/icons/status.svg#icon-tasks"></use>
              </svg>
            </div>

            <div class="section-card-content">
              <h2>${title}</h2>
              <hr />
              <div class="todo-layout ${completedPage ? "todo-layout-list-only" : ""}">
                ${completedPage ? "" : "<task-form></task-form>"}
                <div class="task-list-panel">
                  ${completedPage ? "" : renderTaskFilters(filter)}
                  ${renderActionError($.actionError)}
                  <div id="task-list">
                    ${renderTaskList(
                      $.tasksStatus,
                      filteredTasks,
                      $.error,
                      filter,
                      !completedPage
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    `;

    this.bindControls(editingTask);
  }

  private bindControls(editingTask: Task | undefined) {
    this.querySelector<TaskFormElement>("task-form")?.configure(
      editingTask,
      this.viewModel.$.actionStatus
    );

    this.querySelectorAll<HTMLButtonElement>("[data-task-action]").forEach(
      (button) => {
        button.addEventListener("click", () => {
          const id = button.dataset.taskId;
          const task = (this.viewModel.$.tasks || []).find(
            (candidate) => candidate.id === id
          );

          if (!id) return;

          switch (button.dataset.taskAction) {
            case "edit":
              Store.dispatch<Msg>(this, ["tasks/edit", { id }]);
              break;
            case "toggle":
              if (task) {
                const reactions: TaskReactions = {
                  onFailure: (error: Error) =>
                    console.error("Unable to update task:", error)
                };

                Store.dispatch<Msg>(this, [
                  "tasks/toggle-complete",
                  { task, reactions }
                ]);
              }
              break;
            case "delete":
              if (window.confirm("Delete this task?")) {
                const reactions: TaskReactions = {
                  onFailure: (error: Error) =>
                    console.error("Unable to delete task:", error)
                };

                Store.dispatch<Msg>(this, [
                  "tasks/delete",
                  { id, reactions }
                ]);
              }
              break;
          }
        });
      }
    );
  }
}

function renderTaskList(
  status: LoadStatus,
  tasks: Task[] | undefined,
  error: string | undefined,
  filter: TaskFilter,
  allowEdit: boolean
) {
  if (status === "error") {
    return `<p>${escapeHtml(error || "Unable to load tasks.")}</p>`;
  }

  if (status === "idle" || status === "loading") {
    return "<p>Loading tasks...</p>";
  }

  if (!tasks?.length) {
    if (filter === "completed") return "<p>No completed tasks found.</p>";
    if (filter === "pending") return "<p>No pending tasks found.</p>";

    return "<p>No tasks found.</p>";
  }

  return `
    <div class="task-preview-list">
      ${tasks.map((task) => renderTaskPreview(task, allowEdit)).join("")}
    </div>
  `;
}

function renderTaskFilters(filter: TaskFilter) {
  const links: Array<{ href: string; label: string; filter: TaskFilter }> = [
    { href: "/app", label: "All", filter: "all" },
    { href: "/app?status=pending", label: "Pending", filter: "pending" },
    {
      href: "/app?status=completed",
      label: "Completed",
      filter: "completed"
    }
  ];

  return `
    <nav class="task-filter-nav" aria-label="Task filters">
      ${links
        .map(
          (link) => `
            <a
              href="${link.href}"
              ${filter === link.filter ? 'aria-current="page"' : ""}
            >
              ${link.label}
            </a>
          `
        )
        .join("")}
    </nav>
  `;
}

function getTaskFilter(): TaskFilter {
  const status = new URLSearchParams(window.location.search).get("status");

  if (isCompletedRoute()) return "completed";
  if (status === "completed") return "completed";
  if (status === "pending") return "pending";

  return "all";
}

function isCompletedRoute() {
  return window.location.pathname === "/app/completed";
}

function filterTasks(tasks: Task[] | undefined, filter: TaskFilter) {
  if (!tasks || filter === "all") return tasks;

  const status = filter === "completed" ? "Completed" : "Pending";

  return tasks.filter((task) => task.status === status);
}

function renderTaskPreview(task: Task, allowEdit: boolean) {
  const toggleLabel =
    task.status === "Completed" ? "Reopen" : "Complete";

  return `
    <article class="task-preview-card">
      <h3>${escapeHtml(task.name)}</h3>

      <dl class="task-preview-meta">
        <div>
          <dt>Status</dt>
          <dd>
            <span class="${statusBadgeClass(task.status)}">
              ${escapeHtml(task.status)}
            </span>
          </dd>
        </div>

        <div>
          <dt>Category</dt>
          <dd>${escapeHtml(task.category)}</dd>
        </div>

        <div>
          <dt>Due Date</dt>
          <dd>${escapeHtml(task.dueDate)}</dd>
        </div>
      </dl>

      <div class="task-preview-actions">
        <button
          type="button"
          data-task-action="toggle"
          data-task-id="${escapeHtml(task.id)}"
        >
          ${toggleLabel}
        </button>
        ${
          allowEdit
            ? `<button
                class="secondary-button"
                type="button"
                data-task-action="edit"
                data-task-id="${escapeHtml(task.id)}"
              >
                Edit
              </button>`
            : ""
        }
        <button
          class="danger-button"
          type="button"
          data-task-action="delete"
          data-task-id="${escapeHtml(task.id)}"
        >
          Delete
        </button>
      </div>
    </article>
  `;
}

function renderActionError(error: string | undefined) {
  return error ? `<p class="task-form-error">${escapeHtml(error)}</p>` : "";
}

function statusBadgeClass(status: Task["status"]) {
  return `status-badge ${
    status === "Completed" ? "status-badge-completed" : "status-badge-pending"
  }`;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char] || char
  );
}
