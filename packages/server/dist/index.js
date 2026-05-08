import express from "express";
import Tasks from "./services/task-svc.js";
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));
app.use(express.json());
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.get("/api/tasks", (req, res) => {
    const data = Tasks.index();
    res.send({ tasks: data });
});
app.get("/api/tasks/:id", (req, res) => {
    const id = req.params.id;
    const data = Tasks.get(id);
    if (data) {
        res.send(data);
    }
    else {
        res.status(404).send();
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
