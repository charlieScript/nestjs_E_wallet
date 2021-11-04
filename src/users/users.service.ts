import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { users, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserWithEmail(
    userWhereUniqueInput: Prisma.usersWhereUniqueInput,
  ): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.usersCreateInput): Promise<users> {
    return this.prisma.users.create({
      data,
    });
  }
}
