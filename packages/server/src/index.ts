import express, { Request, Response } from "express";
import Tasks from "./services/task-svc.ts";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/api/tasks", (req: Request, res: Response) => {
  const data = Tasks.index();
  res.send({ tasks: data });
});

app.get("/api/tasks/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = Tasks.get(id);

  if (data) {
    res.send(data);
  } else {
    res.status(404).send();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});