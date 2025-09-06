import { z } from "zod"

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .refine((email) => {
    // Check for common disposable email domains
    const disposableDomains = ["tempmail.org", "10minutemail.com", "guerrillamail.com"]
    const domain = email.split("@")[1]
    return !disposableDomains.includes(domain)
  }, "Please use a permanent email address")

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

// Signup form schema
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    guardianContact: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true // Optional field
        return /^\+?[\d\s\-$$$$]+$/.test(val) && val.replace(/\D/g, "").length >= 10
      }, "Please enter a valid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

// Password strength checker
export function getPasswordStrength(password: string): {
  score: number
  feedback: string
  color: string
} {
  let score = 0
  let feedback = "Very weak"
  let color = "text-red-500"

  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  switch (score) {
    case 0:
    case 1:
      feedback = "Very weak"
      color = "text-red-500"
      break
    case 2:
      feedback = "Weak"
      color = "text-orange-500"
      break
    case 3:
      feedback = "Fair"
      color = "text-yellow-500"
      break
    case 4:
      feedback = "Good"
      color = "text-blue-500"
      break
    case 5:
      feedback = "Strong"
      color = "text-green-500"
      break
  }

  return { score, feedback, color }
}
