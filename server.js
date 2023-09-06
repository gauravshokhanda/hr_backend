const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

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

app.listen(3000, () => console.log("Server started"));
