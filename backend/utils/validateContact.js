// utils/validateContact.js
import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least {#limit} characters",
    "string.max": "Name should not exceed {#limit} characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{1,4}?[-\s]?\(?[0-9]{1,3}?\)?[-\s]?[0-9]{1,4}[-\s]?[0-9]{1,4}[-\s]?[0-9]{1,9}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Please provide a valid phone number",
    }),
  subject: Joi.string().min(5).max(100).required().messages({
    "string.empty": "Subject is required",
    "string.min": "Subject should have at least {#limit} characters",
    "string.max": "Subject should not exceed {#limit} characters",
  }),
  message: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message should have at least {#limit} characters",
    "string.max": "Message should not exceed {#limit} characters",
  }),
});