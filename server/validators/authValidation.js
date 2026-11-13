
const { z } = require("zod");

const registerSchema = z.object({
    username: z.string().trim().min(3, "Username must have at least 3 characters").max(30),
    email: z.string().trim().email("Enter a valid email address").transform(value => value.toLowerCase()),
    password: z.string().min(8, "Password must have at least 8 characters").max(128)
}).strict();

const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address").transform(value => value.toLowerCase()),
    password: z.string().min(1, "Password is required")
}).strict();

module.exports = {
    registerSchema,
    loginSchema
};
