import type { Task } from "server/models";

export type LoadStatus = "idle" | "loading" | "loaded" | "error";
export type ActionStatus = "idle" | "saving" | "error";

export interface Model {
  tasks?: Task[];
  tasksStatus: LoadStatus;
  actionStatus: ActionStatus;
  editingTaskId?: string;
  error?: string;
  actionError?: string;
}

export const init: Model = {
  tasksStatus: "idle",
  actionStatus: "idle"
};
