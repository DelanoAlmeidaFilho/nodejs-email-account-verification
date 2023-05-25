import { celebrate, Segments, Joi } from 'celebrate';

const createUserValidation = celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password:  Joi.string().pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*\\d).+$")).required().min(8),
        password_confirmation: Joi.string()
            .required()
            .valid(Joi.ref('password')),
    },
});

export { createUserValidation };
