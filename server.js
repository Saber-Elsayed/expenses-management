const express = require("express");
const mongoose = require("mongoose");
const expensesRoute = require("../Expensess Management/servers/routes/api");
const bodyParser = require("body-parser");
const path = require("path");
const api = require("./servers/routes/api");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect("mongodb://127.0.0.1:27017/Expenses", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/expenses", expensesRoute);

const port = 3000;
app.listen(port, function () {
  console.log(`Server running on ${port}`);
});
