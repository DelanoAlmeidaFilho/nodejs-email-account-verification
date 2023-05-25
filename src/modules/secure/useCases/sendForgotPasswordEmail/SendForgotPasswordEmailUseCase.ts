import { EtherealMail } from 'config/mail/EtherealMail';
import { IUsersRepository } from 'modules/accounts/repository/IUsersRepository';
import { IResetPasswordTokenRepository } from 'modules/secure/repository/IResetPasswordTokenRepository';
import path from 'path';

import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';
import { AppError } from 'shared/error/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class SendForgotPasswordEmailUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('ResetPasswordTokenRepository')
        private resetPasswordTokenRepository: IResetPasswordTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
    ) {}

    async execute(email: string): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const tokenExists =
            await this.resetPasswordTokenRepository.findTokenByUserId(user.id);

        if (tokenExists) {
            await this.resetPasswordTokenRepository.deleteTokenByUserId(
                user.id,
            );
        }

        const expiresIn = this.dateProvider.addHours(2);

        const token = await this.resetPasswordTokenRepository.generate(
            user.id,
            expiresIn,
        );

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'views',
            'forgot_password.hbs',
        );

        await EtherealMail.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[My App] Reset Password',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token}`,
                },
            },
        });
    }
}

export { SendForgotPasswordEmailUseCase };
