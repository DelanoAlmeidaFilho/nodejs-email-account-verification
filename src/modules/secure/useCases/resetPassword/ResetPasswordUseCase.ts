import { hash } from 'bcryptjs';
import { IUsersRepository } from 'modules/accounts/repository/IUsersRepository';
import { IResetPasswordTokenRepository } from 'modules/secure/repository/IResetPasswordTokenRepository';

import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';
import { AppError } from 'shared/error/AppError';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('ResetPasswordTokenRepository')
        private resetPasswordTokenRepository: IResetPasswordTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
    ) {}

    async execute({ token, password }: IRequest): Promise<void> {
        const tokenReset = await this.resetPasswordTokenRepository.findToken(
            token,
        );

        if (!tokenReset) {
            throw new AppError('token invalid', 401);
        }

        const user = await this.usersRepository.findById(tokenReset.userId);

        if (!user) {
            throw new AppError('user not found', 404);
        }

        const resetTokenExpired = this.dateProvider.isAfter(
            tokenReset.expiresIn,
        );

        if (resetTokenExpired) {
            throw new AppError('token expired');
        }

        const passwordUpdate = await hash(password, 8);

        await this.usersRepository.update({
            id: user.id,
            data: { password: passwordUpdate },
        });

        await this.resetPasswordTokenRepository.deleteTokenByUserId(user.id);
    }
}

export { ResetPasswordUseCase };
