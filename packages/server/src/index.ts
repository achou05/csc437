import { existsSync } from "node:fs";
import path from "node:path";
import express, { Request, Response } from "express";
import { connect } from "./services/mongo.ts";
import auth, { authenticateUser } from "./routes/auth.ts";
import tasks from "./routes/tasks.ts";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = path.resolve(process.env.STATIC || "../app/dist");
const indexHtml = path.join(staticDir, "index.html");

connect("todo");

app.use(express.static(staticDir));
app.use(express.json());

app.use("/auth", auth);
app.use("/api/tasks", authenticateUser, tasks);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get(/^\/app(?:\/.*)?$/, (_req: Request, res: Response) => {
  if (existsSync(indexHtml)) {
    res.sendFile(indexHtml);
    return;
  }

  res.status(404).send("App build not found. Run npm run build -w app.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
