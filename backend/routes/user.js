const express = require("express");
const bcrypt = require("bcrypt");
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

  if (!success) return res.status(404).json({ message: "Invalid input" });

  const user = await User.findOne({ username: req.body.username }, "_id");

  if (user) return res.status(411).json({ message: "User already exists" });

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
  });

  // Hash the password before saving
  newUser.password = await newUser.createHash(req.body.password);

  await newUser.save();

  await Account.create({
    userId: newUser._id,
  });

  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "User signed up successfully!", token });
});

router.post("/signin", async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);

  if (!success) return res.status(404).json({ message: "Invalid input" });

  const user = await User.findOne(
    { username: req.body.username },
    "_id password"
  );

  if (!user) return res.status(411).json({ message: "User does not exist" });

  if (!(await user.validatePassword(req.body.password)))
    return res.status(400).json({ message: "Incorrect Password" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "User signed in successfully!", token });
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateUserSchema.safeParse(req.body);

  if (!success) return res.status(400).json({ message: "Invalid Input" });

  const user = await User.findById(req.userId);
  if (req.body.password) {
    // Check if last password is same
    if (await user.validatePassword(req.body.password))
      return res
        .status(404)
        .json({ message: "Password should not be same as last password" });

    //creating hashed password
    req.body.password = await user.createHash(req.body.password);
  }

  // Find the user by ID and update with new data
  await user.updateOne(req.body);

  res.json({ message: "Updated successfully" });
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
