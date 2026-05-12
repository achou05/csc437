import { Schema, model } from "mongoose";
import { Task } from "../models/index.ts";

const taskSchema = new Schema<Task>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    href: { type: String, required: true },
    status: { type: String, required: true },
    category: { type: String, required: true },
    dueDate: { type: String, required: true }
  },
  { collection: "tasks" }
);

const TaskModel = model<Task>("Task", taskSchema);

function index(): Promise<Task[]> {
  return TaskModel.find();
}

function get(id: string): Promise<Task | undefined> {
  return TaskModel.find({ id })
    .then((list) => list[0])
    .catch(() => {
      throw new Error(`${id} Not Found`);
    });
}

function create(task: Task): Promise<Task> {
  const newTask = new TaskModel(task);
  return newTask.save();
}

function update(id: string, task: Task): Promise<Task | undefined> {
  return TaskModel.findOneAndUpdate({ id }, task, { new: true }).then(
    (updated) => {
      if (!updated) {
        throw new Error(`${id} not updated`);
      }

      return updated;
    }
  );
}

function remove(id: string): Promise<void> {
  return TaskModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) {
      throw new Error(`${id} not deleted`);
    }
  });
}

export default { index, get, create, update, remove };