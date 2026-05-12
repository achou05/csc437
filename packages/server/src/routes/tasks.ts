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

export default router;