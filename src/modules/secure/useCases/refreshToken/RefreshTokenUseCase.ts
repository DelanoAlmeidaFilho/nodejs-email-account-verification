import { sign } from 'jsonwebtoken';
import { IRefreshTokenResponse } from 'modules/secure/DTOs/IRefreshTokenResponse';
import { IRefreshTokenRepository } from 'modules/secure/repository/IRefreshTokenRepository';
import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';
import { AppError } from 'shared/error/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject('RefreshTokenRepository')
        private refreshTokenRepository: IRefreshTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
    ) {}

    async execute(token: string): Promise<IRefreshTokenResponse> {
        const refreshToken = await this.refreshTokenRepository.findToken(token);

        if (!refreshToken) {
            throw new AppError('token invalid');
        }

        const refreshTokenExpired = this.dateProvider.isAfter(
            refreshToken.expiresIn,
        );

        const accessToken = sign({}, process.env.SECRET_ACCESS_TOKEN, {
            subject: refreshToken.userId,
            expiresIn: '40s',
        });

        if (refreshTokenExpired) {
            const expiresIn = this.dateProvider.addSeconds(20);

            await this.refreshTokenRepository.deleteTokenByUserId(
                refreshToken.userId,
            );
            const newRefreshToken = await this.refreshTokenRepository.generate(
                refreshToken.userId,
                expiresIn,
            );

            return { accessToken, refreshToken: newRefreshToken };
        }

        return { accessToken, refreshToken: refreshToken.token };
    }
}

export { RefreshTokenUseCase };
