const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const port = 3000;

app.use(cors());

mongoose.connect(
  "mongodb+srv://gauravshokhanda:gaurav753582@hrbackend.02ymxqx.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to database"));

app.use(express.json());

const employeRouter = require("./routes/employes");
app.use("/employes", employeRouter);

const noticeRouter = require("./routes/noticeBoards");
app.use("/notices", noticeRouter);


app.listen(port, () => console.log("Server started at " + port));
