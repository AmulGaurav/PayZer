const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const authMiddleware = require("../middleware");
const { signupSchema, signinSchema, updateUserSchema } = require("../types");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId, "firstName");

  res.json({ name: user.firstName });
});

router.post("/signup", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body);

  if (!success) return res.status(404).json({ msg: "Invalid input" });

  const user = await User.findOne({ username: req.body.username }, "_id");

  if (user) return res.status(411).json({ msg: "User already exists" });

  const newUser = await User.create(req.body);

  await Account.create({
    userId: newUser._id,
  });

  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ msg: "User signed up successfully!", token });
});

router.post("/signin", async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);

  if (!success) return res.status(404).json({ msg: "Invalid input" });

  const user = await User.findOne(
    { username: req.body.username, password: req.body.password },
    "_id"
  );

  if (!user) return res.status(411).json({ msg: "User does not exist" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ msg: "User signed in successfully!", token });
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateUserSchema.safeParse(req.body);

  if (!success) return res.status(400).json({ msg: "Invalid Input" });

  // Find the user by ID and update with new data
  await User.findByIdAndUpdate(req.userId, req.body, {
    runValidators: true, // Ensures schema validation on update
  });

  res.json({ msg: "Updated successfully" });
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter.toLowerCase() || "";

  const users = await User.find(
    {
      $or: [
        {
          firstName: { $regex: filter, $options: "i" },
        },
        {
          lastName: { $regex: filter, $options: "i" },
        },
      ],
    },
    "firstName lastName"
  );

  res.json({
    users: users.filter((user) => user._id.toString() !== req.userId),
  });
});

module.exports = router;
