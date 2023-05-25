import { RefreshToken } from '@prisma/client';

interface IRefreshTokenRepository {
    generate(userId: string, expiresIn: number): Promise<string>;
    findTokenByUserId(userId: string): Promise<RefreshToken>;
    deleteTokenByUserId(userId: string): Promise<void>;
    findToken(token: string): Promise<RefreshToken>;
}

export { IRefreshTokenRepository };
