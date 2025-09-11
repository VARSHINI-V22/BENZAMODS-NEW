// utils/validateOrder.js
import Joi from "joi";

export const orderSchema = Joi.object({
  customerName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Customer name is required",
      "string.min": "Customer name should have at least {#limit} characters",
      "string.max": "Customer name should not exceed {#limit} characters"
    }),
  customerEmail: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Customer email is required",
      "string.email": "Please provide a valid email address"
    }),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.empty": "Product ID is required",
            "string.pattern.base": "Product ID must be a valid ObjectId"
          }),
        itemName: Joi.string()
          .min(1)
          .max(100)
          .required()
          .messages({
            "string.empty": "Item name is required",
            "string.min": "Item name should have at least {#limit} characters",
            "string.max": "Item name should not exceed {#limit} characters"
          }),
        itemPrice: Joi.number()
          .positive()
          .required()
          .messages({
            "number.base": "Item price must be a number",
            "number.positive": "Item price must be a positive number",
            "any.required": "Item price is required"
          }),
        itemType: Joi.string()
          .min(1)
          .max(50)
          .required()
          .messages({
            "string.empty": "Item type is required",
            "string.min": "Item type should have at least {#limit} characters",
            "string.max": "Item type should not exceed {#limit} characters"
          }),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.min": "Quantity must be at least 1",
            "any.required": "Quantity is required"
          })
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Products must be an array",
      "array.min": "At least one product is required",
      "any.required": "Products are required"
    }),
  totalAmount: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Total amount must be a number",
      "number.positive": "Total amount must be a positive number",
      "any.required": "Total amount is required"
    }),
  shippingAddress: Joi.object({
    street: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        "string.empty": "Street address is required",
        "string.min": "Street address should have at least {#limit} characters",
        "string.max": "Street address should not exceed {#limit} characters"
      }),
    city: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.empty": "City is required",
        "string.min": "City should have at least {#limit} characters",
        "string.max": "City should not exceed {#limit} characters"
      }),
    state: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.empty": "State is required",
        "string.min": "State should have at least {#limit} characters",
        "string.max": "State should not exceed {#limit} characters"
      }),
    zipCode: Joi.string()
      .min(1)
      .max(20)
      .required()
      .messages({
        "string.empty": "Zip code is required",
        "string.min": "Zip code should have at least {#limit} characters",
        "string.max": "Zip code should not exceed {#limit} characters"
      }),
    country: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.empty": "Country is required",
        "string.min": "Country should have at least {#limit} characters",
        "string.max": "Country should not exceed {#limit} characters"
      })
  }).required()
});