// utils/validateOrder.js
import Joi from 'joi';

const orderSchema = Joi.object({
  customerName: Joi.string().min(2).max(50).required(),
  customerEmail: Joi.string().email().required(),
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  totalAmount: Joi.number().min(0).required(),
  status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

export { orderSchema };