import { z } from "zod";

const notRobotField = z.literal(true, { message: "Please confirm you are not a robot." });

export const contactSchema = z.object({
  full_name: z.string().min(2).max(120).trim(),
  email: z.string().email().max(254).trim(),
  phone: z.string().max(30).trim().optional().nullable(),
  subject: z.string().max(200).trim().optional().nullable(),
  message: z.string().min(10).max(5000).trim(),
  inquiry_type: z.enum(["furniture", "custom_order", "training", "general"]).default("general"),
  not_robot: notRobotField,
});

export const newsletterSchema = z.object({
  email: z.string().email().max(254).trim(),
  not_robot: notRobotField,
});

export const testimonialSchema = z.object({
  name: z.string().min(2).max(120).trim(),
  role: z.string().max(120).trim().optional().nullable(),
  message: z.string().min(10).max(2000).trim(),
  rating: z.number().int().min(1).max(5).default(5),
  not_robot: notRobotField,
});

export const newsletterSendSchema = z.object({
  subject: z.string().min(3).max(200).trim(),
  content: z.string().min(10).max(100_000).trim(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
