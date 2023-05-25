import { Router } from 'express';

import {
    forgotValidation,
    resetValidation,
} from '../validators/passwordValidations';
import { SendForgotPasswordEmailController } from 'modules/secure/useCases/sendForgotPasswordEmail/SendForgotPasswordEmailController';
import { ResetPasswordController } from 'modules/secure/useCases/resetPassword/ResetPasswordController';

const passwordRoutes = Router();

passwordRoutes.post(
    '/forgot',
    forgotValidation,
    SendForgotPasswordEmailController.handle,
);

passwordRoutes.post(
    '/reset',
    resetValidation,
    ResetPasswordController.handle,
);

export { passwordRoutes };
