const z = require("zod");

const signupSchema = z.object({
  firstName: z.string().max(20),
  lastName: z.string().max(20),
  password: z.string().min(6).max(20),
  username: z.string().min(3).max(20),
});

const signinSchema = z.object({
  password: z.string().min(6).max(20),
  username: z.string().min(3).max(20),
});

const updateUserSchema = z.object({
  firstName: z.string().max(20).optional(),
  lastName: z.string().max(20).optional(),
  password: z.string().min(6).max(20).optional(),
});

module.exports = {
  signupSchema,
  signinSchema,
  updateUserSchema,
};
