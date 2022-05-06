require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT;

const app = express();

//json and body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./config/db.js");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//test route
app.get("/", (req, res) => {
  res.send("Run Forest run!");
});

//routes
const router = require("./routes/Router.js");
app.use(router);

app.listen(port, () => {
  console.log(`Server is running in ${port}`);
});