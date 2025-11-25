import { z } from 'zod';

//Register Schema

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, { message: "Full name must be at least 2 characters." }),

  email: z.string()
    .email({ message: "Invalid email format." }),

  // Password is required for standard registration, but marked optional in DTO
  // to support OAuth where a password isn't sent. Here, we enforce it.
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

//LOGIN SCHEMA
export const loginSchema = z.object({
  email: z.string()
    .email({ message: "Invalid email format." }),
    
  password: z.string()
    .min(1, { message: "Password is required." }),
});
