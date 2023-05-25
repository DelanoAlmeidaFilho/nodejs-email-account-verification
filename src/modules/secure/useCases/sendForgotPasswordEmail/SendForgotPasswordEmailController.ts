import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { SendForgotPasswordEmailUseCase } from './SendForgotPasswordEmailUseCase';

class SendForgotPasswordEmailController {
    static async handle(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;

        const sendForgotPasswordEmailUseCase = container.resolve(
            SendForgotPasswordEmailUseCase,
        );

        await sendForgotPasswordEmailUseCase.execute(email);

        return res.status(204).send();
    }
}

export { SendForgotPasswordEmailController };
