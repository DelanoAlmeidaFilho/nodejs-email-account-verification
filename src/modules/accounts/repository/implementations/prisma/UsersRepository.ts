import { User } from '@prisma/client';
import { IUserRequest } from 'modules/accounts/DTOs/IUserRequest';
import { IUsersRepository } from '../../IUsersRepository';
import { client } from 'shared/prisma/client';
import { IUpdateUser } from 'modules/accounts/interfaces/IUpdateUser';

class UsersRepository implements IUsersRepository {
    async create(data: IUserRequest): Promise<User> {
        return await client.user.create({ data });
    }
    async findByEmail(email: string): Promise<User> {
        return await client.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User> {
        return await client.user.findUnique({
            where: { id },
        });
    }

    async update({ id, data }: IUpdateUser): Promise<User> {
        return await client.user.update({
            where: { id },
            data,
        });
    }
}

export { UsersRepository };
