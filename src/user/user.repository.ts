// src/user/user.repository.ts
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserWithoutPassword } from '../auth/user-without-password.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User>
{
    constructor(private dataSource: DataSource)
    {
        super(User, dataSource.createEntityManager());
    }

    async findUserWithoutPassword(userId?: number): Promise<UserWithoutPassword[] | UserWithoutPassword | null> {
        const queryBuilder = await this.createQueryBuilder("user")
            .select([
                "user.id",
                "user.email",
                "user.firstName",
                "user.lastName",
                "user.profilePicture",
                "user.googleId",
                "user.facebookId",
                "user.roles",
                "user.createdAt",
                "user.updatedAt"
            ]);

        if (userId) {
            queryBuilder.where("user.id = :id", { id: userId });
            const user = await queryBuilder.getOne();
            return user as UserWithoutPassword | null;
        } else {
            const users = await queryBuilder.getMany();
            return users as UserWithoutPassword[];
        }
    }
}
