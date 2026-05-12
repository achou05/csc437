import express from "express";
import Tasks from "../services/task-svc.js";
const router = express.Router();
router.get("/", (_, res) => {
    Tasks.index()
        .then((list) => {
        res.send({ tasks: list });
    })
        .catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
    const id = req.params.id;
    Tasks.get(id)
        .then((task) => {
        if (!task) {
            res.status(404).send();
        }
        else {
            res.send(task);
        }
    })
        .catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
    const newTask = req.body;
    Tasks.create(newTask)
        .then((task) => {
        res.status(201).json(task);
    })
        .catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const newTask = req.body;
    Tasks.update(id, newTask)
        .then((task) => {
        if (!task) {
            res.status(404).send();
        }
        else {
            res.json(task);
        }
    })
        .catch((err) => res.status(404).send(err));
});
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Tasks.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});
export default router;
