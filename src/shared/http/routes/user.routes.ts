import { Router } from 'express';
import { createUserValidation } from '../validators/userValidations';
import { CreateUserController } from 'modules/accounts/useCases/createUser/CreateUserController';
import { VerifyEmailController } from 'modules/secure/useCases/verifyEmail/VerifyEmailController';
import { verifyValidation } from '../validators/verifyEmailValidations';

const usersRoutes = Router();

usersRoutes.post('/', createUserValidation, CreateUserController.handle);
usersRoutes.post('/verify', verifyValidation, VerifyEmailController.handle);

export { usersRoutes };
