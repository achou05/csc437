import { existsSync } from "node:fs";
import path from "node:path";
import express from "express";
import { connect } from "./services/mongo.js";
import auth, { authenticateUser } from "./routes/auth.js";
import tasks from "./routes/tasks.js";
const app = express();
const port = process.env.PORT || 3000;
const staticDir = path.resolve(process.env.STATIC || "../app/dist");
const indexHtml = path.join(staticDir, "index.html");
connect("todo");
app.use(express.static(staticDir));
app.use(express.json());
app.use("/auth", auth);
app.use("/api/tasks", authenticateUser, tasks);
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.get(/^\/app(?:\/.*)?$/, (_req, res) => {
    if (existsSync(indexHtml)) {
        res.sendFile(indexHtml);
        return;
    }
    res.status(404).send("App build not found. Run npm run build -w app.");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
