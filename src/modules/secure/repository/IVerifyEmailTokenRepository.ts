import { VerifyEmailToken } from '@prisma/client';

interface IVerifyEmailTokenRepository {
    generate(userId: string, expiresIn: number): Promise<string>;
    findToken(token: string): Promise<VerifyEmailToken>;
    deleteTokenByUserId(userId: string): Promise<void>;
}

export { IVerifyEmailTokenRepository };
