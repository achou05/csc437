import { Store } from "@unbndl/store";
import type { Task } from "server/models";
import type { ActionStatus } from "../model.ts";
import type { Msg, TaskReactions } from "../messages.ts";

type TaskFormData = Partial<
  Record<"name" | "status" | "category" | "dueDate", string>
>;

export class TaskFormElement extends HTMLElement {
  private currentTask?: Task;
  private currentActionStatus: ActionStatus = "idle";

  connectedCallback() {
    this.render();
    this.addEventListener("submit", this.submitForm);
    this.addEventListener("click", this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.submitForm);
    this.removeEventListener("click", this.handleClick);
  }

  configure(task: Task | undefined, actionStatus: ActionStatus) {
    this.currentTask = task;
    this.currentActionStatus = actionStatus;
    this.render();
  }

  private submitForm = (event: Event) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const json = this.formDataToJSON(form) as TaskFormData;
    const id = this.currentTask?.id || `task-${Date.now()}`;
    const task: Task = {
      id,
      href: this.currentTask?.href || `/tasks/${id}.html`,
      name: String(json.name || "").trim(),
      status: (json.status || "Pending") as Task["status"],
      category: (json.category || "School") as Task["category"],
      dueDate: String(json.dueDate || "")
    };

    if (!task.name || !task.dueDate) return;

    const reactions: TaskReactions = {
      onSuccess: () => {
        if (!this.currentTask) form.reset();
      },
      onFailure: (error: Error) => {
        console.error("Unable to save task:", error);
      }
    };

    Store.dispatch<Msg>(this, [
      this.currentTask ? "tasks/update" : "tasks/create",
      { task, reactions }
    ]);
  };

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.closest("#cancel-edit")) {
      Store.dispatch<Msg>(this, ["tasks/cancel-edit", {}]);
    }
  };

  formDataToJSON(form: HTMLFormElement): object {
    const inputs = Array.from(form.elements).filter(
      (
        element
      ): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
        (element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement) &&
        Boolean(element.name)
    );

    const entries = inputs.map((element) => [element.name, element.value]);

    return Object.fromEntries(entries);
  }

  private render() {
    const task = this.currentTask;
    const isSaving = this.currentActionStatus === "saving";

    this.innerHTML = `
      <form class="task-form" id="task-form">
        <h3 class="task-form-heading">${task ? "Edit Task" : "Add Task"}</h3>

        <label>
          <span>Task</span>
          <input
            name="name"
            value="${escapeHtml(task?.name || "")}"
            placeholder="Add a task"
            required
          />
        </label>

        <label>
          <span>Status</span>
          <select name="status">
            ${renderOption("Pending", task?.status || "Pending")}
            ${renderOption("Completed", task?.status || "Pending")}
          </select>
        </label>

        <label>
          <span>Category</span>
          <select name="category">
            ${renderOption("School", task?.category || "School")}
            ${renderOption("Personal", task?.category || "School")}
          </select>
        </label>

        <label>
          <span>Due Date</span>
          <input
            type="date"
            name="dueDate"
            value="${escapeHtml(task?.dueDate || "")}"
            required
          />
        </label>

        <div class="task-form-actions">
          <button type="submit" ${isSaving ? "disabled" : ""}>
            ${isSaving ? "Saving..." : task ? "Save Task" : "Add Task"}
          </button>
          ${
            task
              ? '<button id="cancel-edit" class="secondary-button" type="button">Cancel</button>'
              : ""
          }
        </div>
      </form>
    `;
  }
}

function renderOption(value: string, current: string) {
  return `
    <option value="${escapeHtml(value)}" ${value === current ? "selected" : ""}>
      ${escapeHtml(value)}
    </option>
  `;
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
