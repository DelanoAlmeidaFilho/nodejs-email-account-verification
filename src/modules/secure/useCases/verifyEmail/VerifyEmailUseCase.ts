import { EtherealMail } from 'config/mail/EtherealMail';
import { IUsersRepository } from 'modules/accounts/repository/IUsersRepository';
import { IVerifyEmailTokenRepository } from 'modules/secure/repository/IVerifyEmailTokenRepository';
import path from 'path';
import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';
import { AppError } from 'shared/error/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class VerifyEmailUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('VerifyEmailTokenRepository')
        private verifyEmailTokenRepository: IVerifyEmailTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
    ) {}

    async execute(token: string): Promise<void> {
        const tokenVerify = await this.verifyEmailTokenRepository.findToken(
            token,
        );

        if (!tokenVerify) {
            throw new AppError('token invalid', 401);
        }

        const user = await this.usersRepository.findById(tokenVerify.userId);

        if (!user) {
            throw new AppError('user not found', 404);
        }

        const verifyTokenExpired = this.dateProvider.isAfter(
            tokenVerify.expiresIn,
        );

        if (verifyTokenExpired) {
            await this.verifyEmailTokenRepository.deleteTokenByUserId(user.id);

            const expiresIn = this.dateProvider.addHours(48);

            const newToken = await this.verifyEmailTokenRepository.generate(
                user.id,
                expiresIn,
            );

            const verifyEmailTemplate = path.resolve(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                'views',
                'verify_email.hbs',
            );

            await EtherealMail.sendMail({
                to: {
                    name: user.name,
                    email: user.email,
                },
                subject: '[My App] Confirm Account',
                templateData: {
                    file: verifyEmailTemplate,
                    variables: {
                        name: user.name,
                        link: `http://localhost:3000/users/verify?token=${newToken}`,
                    },
                },
            });

            throw new AppError('token expired');
        }

        await this.usersRepository.update({
            id: user.id,
            data: { confirmationEmail: true },
        });

        await this.verifyEmailTokenRepository.deleteTokenByUserId(user.id);
    }
}

export { VerifyEmailUseCase };
