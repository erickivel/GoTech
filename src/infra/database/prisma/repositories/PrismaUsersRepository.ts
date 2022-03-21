import { IUpdatedUserData } from '../../../../useCases/ports/IUpdatedUserData';
import { IUserData } from '../../../../useCases/ports/IUserData';
import { IUsersRepository } from '../../../../useCases/ports/IUsersRepository';
import { prismaClient } from '../PrismaClient';

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: IUserData): Promise<Omit<IUserData, "password">> {
    const userCreated = await prismaClient.users.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        createdAt: data.createdAt,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return userCreated;
  };

  async findByEmail(email: string): Promise<IUserData | null> {
    const user = await prismaClient.users.findFirst({
      where: {
        email,
      }
    });

    return user;
  };

  async findById(id: string): Promise<IUserData | null> {
    const user = await prismaClient.users.findFirst({
      where: {
        id,
      },
    });

    return user;
  };

  async update(data: IUserData): Promise<IUpdatedUserData> {
    const userUpdated = await prismaClient.users.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        updatedAt: data.updatedAt,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return userUpdated;
  }
}