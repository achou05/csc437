import { Task } from "../models/index.ts";

const tasks: { [key: string]: Task } = {
  "task-1": {
    id: "task-1",
    name: "Complete CSC437 Lab 2",
    href: "/tasks/task-1.html",
    status: "Pending",
    category: "School",
    dueDate: "2026-01-30"
  },

  "task-2": {
    id: "task-2",
    name: "Buy weekly groceries",
    href: "/tasks/task-2.html",
    status: "Completed",
    category: "Personal",
    dueDate: "2026-01-25"
  }
};

function get(id: string): Task | undefined {
  return tasks[id];
}

function index(): Task[] {
  return Object.values(tasks);
}

export default { get, index };