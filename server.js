const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const api = require("./servers/routes/api");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", api);

const port = 3000;
app.listen(port, function () {
  console.log(`Server running on ${port}`);
});
