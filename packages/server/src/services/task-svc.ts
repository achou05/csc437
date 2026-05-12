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
      throw `${id} Not Found`;
    });
}

export default { index, get };