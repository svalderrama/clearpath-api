/** REF: https://www.npmjs.com/package/celebrate **/
import { celebrate, Joi, Segments } from "celebrate";

const validateRegisterPost = (req, res, next) =>
  celebrate({
    [Segments.BODY]: Joi.object({
      first_name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  })(req, res, next);

const validateLoginPost = (req, res, next) =>
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  })(req, res, next);

const validateUserDetailsPut = (req, res, next) =>
  celebrate({
    [Segments.BODY]: Joi.object({
      id: Joi.string().required(),
      email: Joi.string(),
      race: Joi.string(),
      sexuality: Joi.string(),
      gender: Joi.string(),
      dob: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      prior_academics: Joi.object().keys({
        level: Joi.string(),
        school: Joi.string(),
        department: Joi.string(),
        specialization: Joi.string(),
        year_of_grad: Joi.string(),
      }),
    }),
  })(req, res, next);

export default {
  validateRegisterPost,
  validateLoginPost,
  validateUserDetailsPut,
};
