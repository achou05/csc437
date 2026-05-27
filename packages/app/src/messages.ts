import type { Task } from "server/models";

export interface TaskReactions {
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
}

export type Msg =
  | ["tasks/request", { refresh?: boolean }]
  | ["tasks/create", { task: Task; reactions?: TaskReactions }]
  | ["tasks/update", { task: Task; reactions?: TaskReactions }]
  | ["tasks/delete", { id: string; reactions?: TaskReactions }]
  | ["tasks/toggle-complete", { task: Task; reactions?: TaskReactions }]
  | ["tasks/edit", { id: string }]
  | ["tasks/cancel-edit", {}];
