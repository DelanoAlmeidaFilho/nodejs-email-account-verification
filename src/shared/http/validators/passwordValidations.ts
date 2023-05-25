import { celebrate, Segments, Joi } from 'celebrate';

const forgotValidation = celebrate({
    [Segments.BODY]: {
        email: Joi.string().email().required(),
    },
});

const resetValidation = celebrate({
    [Segments.BODY]: {
        token: Joi.string().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.string()
            .required()
            .valid(Joi.ref('password')),
    },
});

export { forgotValidation, resetValidation };
