const Joi = require('joi');

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const signupSchema = Joi.object({
  fullname: Joi.string().min(4).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  password: Joi.string().min(6).required(),
  type: Joi.string().required(),
});

exports.validateSignup = validator(signupSchema);
