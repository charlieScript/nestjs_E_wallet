import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { users, Prisma, accounts } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserWithEmail(email): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createUser(data: Prisma.usersCreateInput): Promise<users> {
    return this.prisma.users.create({
      data,
    });
  }

  async createAccount(data: Prisma.accountsCreateManyInput): Promise<accounts> {
    return this.prisma.accounts.create({
      data,
    });
  }
}
