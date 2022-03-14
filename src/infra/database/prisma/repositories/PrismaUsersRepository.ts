import { PrismaClient } from '@prisma/client';

import { IUserData } from '../../../../useCases/ports/IUserData';
import { IUsersRepository } from '../../../../useCases/ports/IUsersRepository';

const prisma = new PrismaClient();

export class PrismaUsersRepository implements IUsersRepository {

  async create(data: IUserData): Promise<void> {
    await prisma.users.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        createdAt: data.createdAt,
      }
    });
  };

  async findByEmail(email: string): Promise<IUserData | null> {
    const user = await prisma.users.findFirst({
      where: {
        email,
      }
    });

    return user;
  }
}