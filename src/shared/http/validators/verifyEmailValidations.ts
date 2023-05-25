import { celebrate, Segments, Joi } from 'celebrate';

const verifyValidation = celebrate({
    [Segments.BODY]: {
        token: Joi.string().required(),
    },
});

export { verifyValidation };
