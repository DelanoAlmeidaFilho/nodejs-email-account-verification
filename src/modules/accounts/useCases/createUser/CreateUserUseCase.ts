import { hash } from 'bcryptjs';
import { EtherealMail } from 'config/mail/EtherealMail';
import { IUserRequest } from 'modules/accounts/DTOs/IUserRequest';
import { IUsersRepository } from 'modules/accounts/repository/IUsersRepository';
import { IVerifyEmailTokenRepository } from 'modules/secure/repository/IVerifyEmailTokenRepository';
import path from 'path';
import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';
import { AppError } from 'shared/error/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class CreateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('VerifyEmailTokenRepository')
        private verifyEmailTokenRepository: IVerifyEmailTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
    ) {}

    async execute({ email, password, name }: IUserRequest): Promise<void> {
        const userExists = await this.usersRepository.findByEmail(email);

        if (userExists) {
            throw new AppError('User already exists');
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password: await hash(password, 8),
        });

        const expiresIn = this.dateProvider.addSeconds(60);

        const verifyToken = await this.verifyEmailTokenRepository.generate(
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
                    link: `http://localhost:3000/users/verify?token=${verifyToken}`,
                },
            },
        });
    }
}

export { CreateUserUseCase };
