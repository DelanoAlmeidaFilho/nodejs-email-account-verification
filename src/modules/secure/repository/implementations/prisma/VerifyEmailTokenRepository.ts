import { VerifyEmailToken } from '@prisma/client';
import { IVerifyEmailTokenRepository } from '../../IVerifyEmailTokenRepository';
import { client } from 'shared/prisma/client';

class VerifyEmailTokenRepository implements IVerifyEmailTokenRepository {
    async generate(userId: string, expiresIn: number): Promise<string> {
        const { token } = await client.verifyEmailToken.create({
            data: {
                userId,
                expiresIn,
            },
        });

        return token;
    }

    async findToken(token: string): Promise<VerifyEmailToken> {
        return await client.verifyEmailToken.findUnique({
            where: { token },
        });
    }

    async deleteTokenByUserId(userId: string): Promise<void> {
        await client.verifyEmailToken.delete({
            where: { userId },
        });
    }
}

export { VerifyEmailTokenRepository };
