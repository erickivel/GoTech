import { IUserData } from '../../../../useCases/authentication/ports/IUserData';
import { IUsersRepository } from '../../../../useCases/authentication/ports/IUsersRepository';
import { prismaClient } from '../PrismaClient';

export class PrismaUsersRepository implements IUsersRepository {
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
}