const express = require("express");
const userRouter = require("./user");
const accountRouter = require("./account");

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

// Test Route
router.get("/test", (req, res) => {
  res.json({ message: "Hello, World!" });
});

module.exports = router;
