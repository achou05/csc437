const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    .task-list {
      display: grid;
      gap: 1rem;
    }
  </style>

  <section class="task-list"></section>
`;

function renderTask(task) {
  return `
    <todo-task-preview
      href="${task.href}"
      status="${task.status}"
      category="${task.category}"
      due-date="${task.dueDate}"
    >
      ${task.name}
    </todo-task-preview>
  `;
}

export class TodoTaskListElement extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src" && newValue) {
      this.hydrate(newValue).then((data) => {
        this.render(data);
      });
    }
  }

  hydrate(src) {
    return fetch(src)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`HTTP Status ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.log(`Could not fetch ${src}:`, error);
        return { tasks: [] };
      });
  }

  render(data) {
    const root = this.shadowRoot.querySelector(".task-list");
    if (!root) return;

    const tasks = data?.tasks || [];
    root.innerHTML = tasks.map(renderTask).join("");
  }
}