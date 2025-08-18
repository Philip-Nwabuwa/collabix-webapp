import { z } from "zod";

// Authentication form types and validation schemas
// Zod schema for login form validation
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  rememberMe: z.boolean(),
});

// Infer the type from the Zod schema
export type LoginFormData = z.infer<typeof loginFormSchema>;