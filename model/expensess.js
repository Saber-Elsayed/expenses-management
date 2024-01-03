const mongoose = require("mongoose");
const data = require("../expenses-data/expenses.json");

mongoose
  .connect("mongodb://127.0.0.1:27017/Expensses", {
    useNewUrlParser: true,
  })
  .catch((err) => console.log(err));
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  item: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  group: {
    type: String,
    required: true,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
console.log(data);
