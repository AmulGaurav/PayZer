const z = require("zod");

const signupSchema = z.object({
  firstName: z.string().max(30),
  lastName: z.string().max(30),
  password: z.string().min(6).max(20),
  username: z.string().email().min(5).max(50),
});

const signinSchema = z.object({
  password: z.string().min(6).max(20),
  username: z.string().email().min(5).max(50),
});

const updateUserSchema = z.object({
  firstName: z.string().max(30).optional(),
  lastName: z.string().max(30).optional(),
  password: z.string().min(6).max(20).optional(),
});

module.exports = {
  signupSchema,
  signinSchema,
  updateUserSchema,
};
