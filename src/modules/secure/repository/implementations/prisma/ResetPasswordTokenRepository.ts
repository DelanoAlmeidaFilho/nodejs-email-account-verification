import { ResetPasswordToken } from '@prisma/client';
import { IResetPasswordTokenRepository } from '../../IResetPasswordTokenRepository';
import { client } from 'shared/prisma/client';

class ResetPasswordTokenRepository implements IResetPasswordTokenRepository {
    async generate(userId: string, expiresIn: number): Promise<string> {
        const { token } = await client.resetPasswordToken.create({
            data: {
                userId,
                expiresIn,
            },
        });

        return token;
    }

    async findToken(token: string): Promise<ResetPasswordToken> {
        return await client.resetPasswordToken.findUnique({
            where: { token },
        });
    }

    async deleteTokenByUserId(userId: string): Promise<void> {
        await client.resetPasswordToken.delete({
            where: {
                userId,
            },
        });
    }

    async findTokenByUserId(userId: string): Promise<ResetPasswordToken> {
        return await client.resetPasswordToken.findUnique({
            where: { userId },
        });
    }
}

export { ResetPasswordTokenRepository };
