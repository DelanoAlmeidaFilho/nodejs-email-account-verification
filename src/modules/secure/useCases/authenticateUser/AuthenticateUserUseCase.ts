import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IUsersRepository } from 'modules/accounts/repository/IUsersRepository';
import { IAuthenticateRequest } from 'modules/secure/DTOs/IAuthenticateRequest';
import { IAuthenticateResponse } from 'modules/secure/DTOs/IAuthenticateResponse';
import { IRefreshTokenRepository } from 'modules/secure/repository/IRefreshTokenRepository';
import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';
import { AppError } from 'shared/error/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('RefreshTokenRepository')
        private refreshTokenRepository: IRefreshTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
    ) {}

    async execute({
        email,
        password,
    }: IAuthenticateRequest): Promise<IAuthenticateResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Email or password incorrect!', 401);
        }

        if (!user.confirmationEmail) {
            throw new AppError('Confirm your email address', 401);
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError('Email or password incorrect!', 401);
        }

        const accessToken = sign({}, process.env.SECRET_ACCESS_TOKEN, {
            subject: user.id,
            expiresIn: '40s',
        });

        const existsRefreshToken =
            await this.refreshTokenRepository.findTokenByUserId(user.id);

        if (existsRefreshToken) {
            await this.refreshTokenRepository.deleteTokenByUserId(user.id);
        }

        const expiresIn = this.dateProvider.addSeconds(20);

        const refreshToken = await this.refreshTokenRepository.generate(
            user.id,
            expiresIn,
        );

        return {
            accessToken,
            refreshToken,
        };
    }
}

export { AuthenticateUserUseCase };
