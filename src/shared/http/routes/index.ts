import { Request, Response, Router } from 'express';
import { usersRoutes } from './user.routes';
import { authenticateRoutes } from './authenticate.routes';
import { auth } from '../middlewares/auth';
import { passwordRoutes } from './password.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/password', passwordRoutes);
routes.use(authenticateRoutes);

routes.get('/private', auth, (req: Request, res: Response) => {
    res.send('this is a private route');
});

export { routes };
