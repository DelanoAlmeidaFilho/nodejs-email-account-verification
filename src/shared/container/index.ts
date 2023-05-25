import { container } from 'tsyringe';

import './providers';

import { IUsersRepository } from 'modules/accounts/repository/IUsersRepository';
import { UsersRepository } from 'modules/accounts/repository/implementations/prisma/UsersRepository';
import { IRefreshTokenRepository } from 'modules/secure/repository/IRefreshTokenRepository';
import { RefreshTokenRepository } from 'modules/secure/repository/implementations/prisma/RefreshTokenRepository';
import { IResetPasswordTokenRepository } from 'modules/secure/repository/IResetPasswordTokenRepository';
import { ResetPasswordTokenRepository } from 'modules/secure/repository/implementations/prisma/ResetPasswordTokenRepository';
import { IVerifyEmailTokenRepository } from 'modules/secure/repository/IVerifyEmailTokenRepository';
import { VerifyEmailTokenRepository } from 'modules/secure/repository/implementations/prisma/VerifyEmailTokenRepository';

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);

container.registerSingleton<IRefreshTokenRepository>(
    'RefreshTokenRepository',
    RefreshTokenRepository,
);

container.registerSingleton<IResetPasswordTokenRepository>(
    'ResetPasswordTokenRepository',
    ResetPasswordTokenRepository,
);

container.registerSingleton<IVerifyEmailTokenRepository>(
    'VerifyEmailTokenRepository',
    VerifyEmailTokenRepository,
);
