import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';

class RefreshTokenController {
    static async handle(req: Request, res: Response): Promise<Response> {
        const { refresh_token } = req.body;

        const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
        const response = await refreshTokenUseCase.execute(refresh_token);

        return res.json(response);
    }
}

export {RefreshTokenController}