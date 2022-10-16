require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dataRoute = require("./routes/data");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const api = process.env.API_URL;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => console.log(err));

mongoose.connection.on("disconnected", () =>
  console.log("mongoDB disconnected!")
);

mongoose.connection.on("connected", () => console.log("mongoDB connected!"));

app.use(cors());
app.use(bodyParser.json());
app.use(`${api}`, dataRoute);

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
});

app.listen(process.env.PORT || 5000, function () {
  console.log("Backend Server Running!");
  console.log(`Listening on port ${process.env.PORT}`);
});
