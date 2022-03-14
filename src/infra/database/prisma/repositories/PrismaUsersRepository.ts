import { IUserData } from '../../../../useCases/ports/IUserData';
import { IUsersRepository } from '../../../../useCases/ports/IUsersRepository';
import { prismaClient } from '../PrismaClient';

export class PrismaUsersRepository implements IUsersRepository {

  async create(data: IUserData): Promise<void> {
    await prismaClient.users.create({
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
    const user = await prismaClient.users.findFirst({
      where: {
        email,
      }
    });

    return user;
  }
}