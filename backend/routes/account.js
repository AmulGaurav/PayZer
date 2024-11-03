const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware");
const { Account, User } = require("../db");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId }, "balance");

  res.json({ balance: account.balance });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, to } = req.body;

    if (req.userId === to) throw new Error();

    const sender = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (sender.balance < amount)
      return res.status(400).json({ msg: "Insufficient balance" });

    const receiver = await Account.findOne({ userId: to }).session(session);

    sender.balance -= parseInt(amount);
    receiver.balance += parseInt(amount);

    await sender.save();
    await receiver.save();

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: "Money sent successfully" });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ msg: "Transaction failed" });
  }
});

module.exports = router;
