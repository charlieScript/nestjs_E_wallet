import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { P2pController } from './p2p/p2p.controller';
import { P2pModule } from './p2p/p2p.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UsersModule, AuthModule, CardsModule, P2pModule],
  controllers: [AppController, P2pController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
