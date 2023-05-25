import { client } from 'shared/prisma/client';
import { IRefreshTokenRepository } from '../../IRefreshTokenRepository';

import { RefreshToken } from '@prisma/client';

class RefreshTokenRepository implements IRefreshTokenRepository {
    async generate(userId: string, expiresIn: number): Promise<string> {
        const { token } = await client.refreshToken.create({
            data: {
                userId,
                expiresIn,
            },
        });

        return token;
    }

    async findTokenByUserId(userId: string): Promise<RefreshToken> {
        return await client.refreshToken.findUnique({
            where: {
                userId,
            },
        });
    }

    async deleteTokenByUserId(userId: string): Promise<void> {
        await client.refreshToken.delete({
            where: {
                userId,
            },
        });
    }

    async findToken(token: string): Promise<RefreshToken> {
        return await client.refreshToken.findUnique({
            where: { token },
        });
    }
}

export { RefreshTokenRepository };
