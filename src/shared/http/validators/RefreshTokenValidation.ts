import { celebrate, Segments, Joi } from 'celebrate';

const refreshTokenValidation = celebrate({
    [Segments.BODY]: {
        refresh_token: Joi.string().required(),
    },
});

export { refreshTokenValidation };
