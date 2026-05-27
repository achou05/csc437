import { Auth } from "@unbndl/auth";
import type { ThenUpdate } from "@unbndl/store";
import type { Task } from "server/models";
import type { Model } from "./model.ts";
import type { Msg, TaskReactions } from "./messages.ts";

type TasksResponse = {
  tasks?: Task[];
};

export type Cmd =
  | ["tasks/load", { tasks: Task[] }]
  | ["task/save-load", { task: Task }]
  | ["task/delete-load", { id: string }]
  | ["tasks/fail", { message: string }];

export function update(
  model: Model,
  message: Msg | Cmd,
  user: Auth.Model
): Model | ThenUpdate<Model, Cmd> {
  const [type, payload] = message;

  switch (type) {
    case "tasks/request":
      if (
        !payload.refresh &&
        (model.tasksStatus === "loading" || model.tasksStatus === "loaded")
      ) {
        return model;
      }

      return [
        {
          ...model,
          tasksStatus: "loading",
          error: undefined
        },
        requestTasks(user)
      ];

    case "tasks/load":
      return {
        ...model,
        tasks: payload.tasks,
        tasksStatus: "loaded",
        error: undefined
      };

    case "tasks/create":
      return [
        {
          ...model,
          actionStatus: "saving",
          actionError: undefined
        },
        createTask(payload.task, user, payload.reactions)
      ];

    case "tasks/update":
      return [
        {
          ...model,
          actionStatus: "saving",
          actionError: undefined
        },
        updateTask(payload.task, user, payload.reactions)
      ];

    case "tasks/delete":
      return [
        {
          ...model,
          actionStatus: "saving",
          actionError: undefined
        },
        deleteTask(payload.id, user, payload.reactions)
      ];

    case "tasks/toggle-complete": {
      const task: Task = {
        ...payload.task,
        status: payload.task.status === "Completed" ? "Pending" : "Completed"
      };

      return [
        {
          ...model,
          actionStatus: "saving",
          actionError: undefined
        },
        updateTask(task, user, payload.reactions)
      ];
    }

    case "tasks/edit":
      return {
        ...model,
        editingTaskId: payload.id,
        actionError: undefined
      };

    case "tasks/cancel-edit":
      return {
        ...model,
        editingTaskId: undefined,
        actionError: undefined
      };

    case "task/save-load":
      return {
        ...model,
        tasks: upsertTask(model.tasks || [], payload.task),
        tasksStatus: "loaded",
        actionStatus: "idle",
        editingTaskId: undefined,
        error: undefined,
        actionError: undefined
      };

    case "task/delete-load":
      return {
        ...model,
        tasks: (model.tasks || []).filter((task) => task.id !== payload.id),
        tasksStatus: "loaded",
        actionStatus: "idle",
        editingTaskId:
          model.editingTaskId === payload.id ? undefined : model.editingTaskId,
        actionError: undefined
      };

    case "tasks/fail":
      return {
        ...model,
        tasksStatus:
          model.tasksStatus === "idle" || model.tasksStatus === "loading"
            ? "error"
            : model.tasksStatus,
        actionStatus: "error",
        error:
          model.tasksStatus === "idle" || model.tasksStatus === "loading"
            ? payload.message
            : model.error,
        actionError: payload.message
      };

    default: {
      const unhandled: never = type;
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  }
}

function requestTasks(user: Auth.Model): Promise<Cmd> {
  return fetch("/api/tasks", {
    headers: authHeaders(user)
  })
    .then((response: Response) => {
      if (response.status === 401) {
        throw new Error("Please log in to view tasks.");
      }

      if (!response.ok) {
        throw new Error("Unable to load tasks from the server.");
      }

      return response.json() as Promise<TasksResponse>;
    })
    .then((json: TasksResponse): Cmd => [
      "tasks/load",
      { tasks: Array.isArray(json.tasks) ? json.tasks : [] }
    ])
    .catch((error: Error): Cmd => [
      "tasks/fail",
      { message: error.message || "Unable to load tasks." }
    ]);
}

function createTask(
  task: Task,
  user: Auth.Model,
  reactions: TaskReactions | undefined
): Promise<Cmd> {
  return saveTask("/api/tasks", "POST", task, user, reactions);
}

function updateTask(
  task: Task,
  user: Auth.Model,
  reactions: TaskReactions | undefined
): Promise<Cmd> {
  return saveTask(`/api/tasks/${task.id}`, "PUT", task, user, reactions);
}

function saveTask(
  url: string,
  method: "POST" | "PUT",
  task: Task,
  user: Auth.Model,
  reactions: TaskReactions | undefined
): Promise<Cmd> {
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(user)
    },
    body: JSON.stringify(task)
  })
    .then((response: Response) => {
      if (response.status === 401) {
        throw new Error("Please log in to save tasks.");
      }

      if (!response.ok) {
        throw new Error("Unable to save this task.");
      }

      return response.json() as Promise<Task>;
    })
    .then((task: Task): Cmd => {
      reactions?.onSuccess?.();
      return ["task/save-load", { task }];
    })
    .catch((error: Error): Cmd => {
      reactions?.onFailure?.(error);
      return [
        "tasks/fail",
        { message: error.message || "Unable to save this task." }
      ];
    });
}

function deleteTask(
  id: string,
  user: Auth.Model,
  reactions: TaskReactions | undefined
): Promise<Cmd> {
  return fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(user)
  })
    .then((response: Response): Cmd => {
      if (response.status === 401) {
        throw new Error("Please log in to delete tasks.");
      }

      if (!response.ok) {
        throw new Error("Unable to delete this task.");
      }

      reactions?.onSuccess?.();
      return ["task/delete-load", { id }];
    })
    .catch((error: Error): Cmd => {
      reactions?.onFailure?.(error);
      return [
        "tasks/fail",
        { message: error.message || "Unable to delete this task." }
      ];
    });
}

function upsertTask(tasks: Task[], savedTask: Task) {
  const exists = tasks.some((task) => task.id === savedTask.id);

  if (!exists) return [...tasks, savedTask];

  return tasks.map((task) => (task.id === savedTask.id ? savedTask : task));
}

function authHeaders(user: Auth.Model) {
  const headers = Auth.headers(user);
  const savedToken =
    localStorage.getItem("un-auth:token") || localStorage.getItem("token");

  if (!headers.Authorization && savedToken) {
    return { Authorization: `Bearer ${savedToken}` };
  }

  return headers;
}
