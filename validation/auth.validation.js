const Joi = require("joi");
const { validateSchema } = require("../helper");

const email = { email: Joi.string().email().required() };

const password = {
  password: Joi.string().required(),
};

const signUp = Joi.object({
  first_name: Joi.string().alphanum().min(3).max(30).required(),
  last_name: Joi.string().alphanum().min(3).max(30).required(),
  profile_image: Joi.string().required(),
  date_of_birth: Joi.string().required(),
  ...email,
  ...password,
});

const forgotPassword = Joi.object({
  ...email,
});

const verifyTokenWithEmail = Joi.object({
  token: Joi.string().required(),
});

const signIn = Joi.object({
  ...password,
  ...email,
});

const resetPassword = Joi.object({
  _id: Joi.string().required(),
  ...password,
});

const signUpSchema = validateSchema(signUp);
const signInSchema = validateSchema(signIn);
const forgotPasswordSchema = validateSchema(forgotPassword);
const verifyTokenWithEmailSchema = validateSchema(verifyTokenWithEmail);
const resetPasswordSchema = validateSchema(resetPassword);

module.exports = {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  verifyTokenWithEmailSchema,
  resetPasswordSchema,
};
