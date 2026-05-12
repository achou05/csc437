import express from "express";
import { connect } from "./services/mongo.js";
import tasks from "./routes/tasks.js";
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
connect("todo");
app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/tasks", tasks);
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
