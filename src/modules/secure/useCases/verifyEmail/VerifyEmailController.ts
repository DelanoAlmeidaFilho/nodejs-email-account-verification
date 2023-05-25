import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { VerifyEmailUseCase } from './VerifyEmailUseCase';

class VerifyEmailController {
    static async handle(req: Request, res: Response): Promise<Response> {
        const { token } = req.body;

        const verifyEmailUseCase = container.resolve(VerifyEmailUseCase);

        await verifyEmailUseCase.execute(token);

        return res.status(204).send();
    }
}

export { VerifyEmailController };
