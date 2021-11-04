import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
})
export class UsersModule {}
