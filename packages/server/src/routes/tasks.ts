import express, { Request, Response } from "express";
import { Task } from "../models/index.ts";
import Tasks from "../services/task-svc.ts";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Tasks.index()
    .then((list: Task[]) => {
      res.send({ tasks: list });
    })
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;

  Tasks.get(id)
    .then((task: Task | undefined) => {
      if (!task) {
        res.status(404).send();
      } else {
        res.send(task);
      }
    })
    .catch((err) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newTask = req.body as Task;

  Tasks.create(newTask)
    .then((task: Task) => {
      res.status(201).json(task);
    })
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const newTask = req.body as Task;

  Tasks.update(id, newTask)
    .then((task: Task | undefined) => {
      if (!task) {
        res.status(404).send();
      } else {
        res.json(task);
      }
    })
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;

  Tasks.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;