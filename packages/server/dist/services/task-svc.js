import { Schema, model } from "mongoose";
const taskSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    href: { type: String, required: true },
    status: { type: String, required: true },
    category: { type: String, required: true },
    dueDate: { type: String, required: true }
}, { collection: "tasks" });
const TaskModel = model("Task", taskSchema);
function index() {
    return TaskModel.find();
}
function get(id) {
    return TaskModel.find({ id })
        .then((list) => list[0])
        .catch(() => {
        throw `${id} Not Found`;
    });
}
export default { index, get };
