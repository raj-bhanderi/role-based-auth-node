const Joi = require("joi");
const { validateSchema } = require("../helper");

const update = Joi.object({
  first_name: Joi.string().alphanum().min(3).max(30).required(),
  last_name: Joi.string().alphanum().min(3).max(30).required(),
  profile_image: Joi.string().required(),
  date_of_birth: Joi.string().required(),
  email: Joi.string().email().required()
});

const updateUserSchema = validateSchema(update);

module.exports = {
  updateUserSchema,
};
