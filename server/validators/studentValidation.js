
const { z } = require("zod");

// MongoDB ObjectId validation
const objectIdSchema = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Please provide a valid MongoDB ID"
);

// Student registration validation
const studentCreateSchema = z.object({
    fullName: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(80, "Name is too long"),

    email: z.string()
        .trim()
        .email("Please enter a valid email address")
        .max(254)
        .transform(value => value.toLowerCase()),

    mobile: z.string()
        .trim()
        .regex(/^\+?[1-9][0-9]{9,14}$/, "Enter a valid mobile number"),

    gender: z.enum(
        ["Male", "Female", "Other"],
        { message: "Please select a valid gender" }
    ),

    course: z.union([
        objectIdSchema,
        z.literal(""),
        z.null()
    ]).optional().transform(value => value === "" ? null : value),

    address: z.string()
        .trim()
        .min(3, "Address must contain at least 3 characters")
        .max(200, "Address is too long")
}).strict();

// Student update validation
const studentUpdateSchema = z.object({
    fullName: z.string()
        .trim()
        .min(2)
        .max(80)
        .optional(),

    email: z.string()
        .trim()
        .email("Please enter a valid email")
        .max(254)
        .transform(value => value.toLowerCase())
        .optional(),

    mobile: z.string()
        .trim()
        .regex(/^\+?[1-9][0-9]{9,14}$/, "Invalid mobile number")
        .optional(),

    gender: z.enum(["Male", "Female", "Other"]).optional(),

    course: z.union([
        objectIdSchema,
        z.literal(""),
        z.null()
    ]).optional().transform(value => value === "" ? null : value),

    address: z.string()
        .trim()
        .min(3)
        .max(200)
        .optional(),

    enrollmentStatus: z.enum([
        "Enrolled",
        "Active",
        "Completed",
        "Dropped"
    ]).optional()

}).strict().refine(
    data => Object.keys(data).length > 0,
    "At least one field is required for an update"
);

// Validate MongoDB IDs in route parameters
const idParamsSchema = z.object({
    id: objectIdSchema
}).strict();
const studentIdParamsSchema = z.object({
    studentId: objectIdSchema
}).strict();

const fileIdParamsSchema = z.object({
    fileId: objectIdSchema
}).strict();
// Application role values
const roleSchema = z.enum([
    "Admin",
    "Staff",
    "Viewer"
]);

module.exports = {
    studentCreateSchema,
    studentUpdateSchema,
    idParamsSchema,
    roleSchema
};
