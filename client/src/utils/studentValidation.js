
import { z } from "zod";

const studentFormSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),

  email: z.string()
    .trim()
    .email("Enter a valid email address")
    .transform(value => value.toLowerCase()),

  mobile: z.string()
    .trim()
    .regex(/^\+?[1-9][0-9]{9,14}$/, "Enter a valid mobile number"),

  gender: z.enum(["Male", "Female", "Other"]),

  course: z.union([
    z.string().regex(/^[0-9a-fA-F]{24}$/, "Select a valid course"),
    z.literal(""),
    z.null()
  ]),

  address: z.string()
    .trim()
    .min(3, "Address must contain at least 3 characters")
    .max(200, "Address cannot exceed 200 characters")
});

export const validateStudentForm = (formData) => {
  const result = studentFormSchema.safeParse(formData);

  if (result.success) {
    return {};
  }

  const errors = {};

  result.error.issues.forEach(issue => {
    const field = issue.path[0];

    if (field) {
      errors[field] = issue.message;
    }
  });

  return errors;
};
