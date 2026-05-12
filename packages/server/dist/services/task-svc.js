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
        throw new Error(`${id} Not Found`);
    });
}
function create(task) {
    const newTask = new TaskModel(task);
    return newTask.save();
}
function update(id, task) {
    return TaskModel.findOneAndUpdate({ id }, task, { new: true }).then((updated) => {
        if (!updated) {
            throw new Error(`${id} not updated`);
        }
        return updated;
    });
}
function remove(id) {
    return TaskModel.findOneAndDelete({ id }).then((deleted) => {
        if (!deleted) {
            throw new Error(`${id} not deleted`);
        }
    });
}
export default { index, get, create, update, remove };
