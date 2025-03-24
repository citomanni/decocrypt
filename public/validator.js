const Joi = require('joi');

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: true });

const sigupSchema = Joi.object({
  fullname: Joi.string().min(4).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
  country: Joi.string().required(),
  password: Joi.string().min(6).required(),
  type: Joi.string().required(),
});

exports.validateSignup = validator(sigupSchema);
