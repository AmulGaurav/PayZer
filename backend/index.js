const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { dbName: "paytm" });

app.use(cors());
app.use(express.json());
app.use("/api/v1", mainRouter);

app.listen(port, () => {
  console.log("listening on port: " + port);
});
