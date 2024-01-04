const express = require("express");
const moment = require("moment");

const bodyParser = require("body-parser");
const router = express.Router();
const Expense = require("../../model/expensess");
// router.get("/", async (req, res) => {
//   try {
//     const expenses = await Expense.find().sort({ date: -1 });
//     res.json(expenses);
//   } catch (error) {
//     console.error("Error fetching expenses:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const { item, amount, group, date } = req.body;
    console.log(req.body);

    const validGroups = ["fun", "food", "rent", "bills", "misc"];
    if (!validGroups.includes(group)) {
      return res.status(400).json({ error: "Invalid expense group" });
    }

    const expenseDate = date
      ? moment(date).format("LLLL")
      : moment().format("LLLL");

    const newExpense = new Expense({
      item,
      amount,
      group,
      date: expenseDate,
    });

    newExpense
      .save()
      .then((savedExpense) => {
        console.log(
          `Expense of $${savedExpense.amount} spent on ${savedExpense.item} saved to the database.`
        );
        res.status(201).json(savedExpense);
      })
      .catch((saveError) => {
        console.error("Error saving expense to the database:", saveError);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/", async (req, res) => {
  try {
    const { group1, group2 } = req.body;

    const expenseToUpdate = await Expense.findOneAndUpdate(
      { group: group1 },
      { $set: { group: group2 } },
      { new: true }
    );

    if (expenseToUpdate) {
      res.send(
        `Expense "${expenseToUpdate.item}" group changed from "${group1}" to "${group2}".`
      );
    } else {
      res.status(404).send(`No expense found for group "${group1}".`);
    }
  } catch (error) {
    console.error("Error updating expense group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:group", async (req, res) => {
  try {
    const { group } = req.params;
    const { total } = req.query;

    if (total === "true") {
      const totalExpenses = await Expense.aggregate([
        { $match: { group } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      res.json({ group, totalAmount: totalExpenses[0]?.totalAmount || 0 });
    } else {
      const expenses = await Expense.find({ group });
      res.json(expenses);
    }
  } catch (error) {
    console.error("Error fetching expenses by group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
