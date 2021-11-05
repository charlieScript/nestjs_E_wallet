import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [UsersModule, AuthModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
