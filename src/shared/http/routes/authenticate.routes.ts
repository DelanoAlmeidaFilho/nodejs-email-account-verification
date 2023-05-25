import { Router } from 'express';
import { authenticateValidation } from '../validators/authenticateValidations';
import { AuthenticateUserController } from 'modules/secure/useCases/authenticateUser/AuthenticateUserController';
import { RefreshTokenController } from 'modules/secure/useCases/refreshToken/RefreshTokenController';
import { refreshTokenValidation } from '../validators/RefreshTokenValidation';

const authenticateRoutes = Router();

authenticateRoutes.post(
    '/session',
    authenticateValidation,
    AuthenticateUserController.handle,
);

authenticateRoutes.post(
    '/refresh-token',
    refreshTokenValidation,
    RefreshTokenController.handle,
);

export { authenticateRoutes };
