import { z } from "zod";
import type { User } from "./user";

// Authentication form types and validation schemas
// Zod schema for login form validation
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Infer the type from the Zod schema
export type LoginFormData = z.infer<typeof loginFormSchema>;

// Login response type that matches the API response structure
export interface LoginResponse {
  accessToken: string;
  user: User;
}
