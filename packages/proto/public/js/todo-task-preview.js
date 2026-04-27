const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      display: block;
      margin-bottom: 1rem;
    }

    .task-card {
      background: var(--color-background-card);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 1rem 1.1rem;
    }

    .task-title {
      margin: 0 0 0.85rem 0;
      font-family: var(--font-family-display);
      font-size: 1.2rem;
      color: var(--color-text);
    }

    .task-link {
      color: var(--color-text);
      text-decoration: none;
    }

    .task-link:hover {
      text-decoration: underline;
    }

    .task-meta {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;
      margin: 0;
    }

    .task-meta div {
      display: grid;
      gap: 0.2rem;
    }

    dt {
      font-size: 0.82rem;
      color: var(--color-text-muted);
    }

    dd {
      margin: 0;
      color: var(--color-text);
      font-size: 0.95rem;
    }
  </style>

  <article class="task-card">
    <h3 class="task-title">
      <a class="task-link" href="#">
        <slot>Task Title</slot>
      </a>
    </h3>

    <dl class="task-meta">
      <div>
        <dt>Status</dt>
        <dd class="status"></dd>
      </div>
      <div>
        <dt>Category</dt>
        <dd class="category"></dd>
      </div>
      <div>
        <dt>Due Date</dt>
        <dd class="due-date"></dd>
      </div>
    </dl>
  </article>
`;

export class TodoTaskPreviewElement extends HTMLElement {
  static get observedAttributes() {
    return ["href", "status", "category", "due-date"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.shadowRoot) return;

    switch (name) {
      case "href": {
        const link = this.shadowRoot.querySelector(".task-link");
        if (link) link.setAttribute("href", newValue);
        break;
      }
      case "status": {
        const status = this.shadowRoot.querySelector(".status");
        if (status) status.textContent = newValue;
        break;
      }
      case "category": {
        const category = this.shadowRoot.querySelector(".category");
        if (category) category.textContent = newValue;
        break;
      }
      case "due-date": {
        const dueDate = this.shadowRoot.querySelector(".due-date");
        if (dueDate) dueDate.textContent = newValue;
        break;
      }
    }
  }
}