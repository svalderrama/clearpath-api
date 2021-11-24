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
      race: Joi.string(),
      sexuality: Joi.string(),
      gender: Joi.string(),
      dob: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      priorAcademics: Joi.object().keys({
        level: Joi.string(),
        school: Joi.string(),
        department: Joi.string(),
        specialization: Joi.string(),
        yearfGrad: Joi.string(),
      }),
    }),
  })(req, res, next);

export default {
  validateRegisterPost,
  validateLoginPost,
  validateUserDetailsPut,
};
