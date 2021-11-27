import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TransactionService } from './transactions.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, TransactionService, PrismaService],
  exports: [TransactionService],
})
export class CardsModule {}
