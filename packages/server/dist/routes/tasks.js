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
export default router;
