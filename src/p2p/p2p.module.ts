import { Module } from '@nestjs/common';
import { P2pService } from './p2p.service';
import { PrismaService } from 'src/prisma.service';
import { TransactionService } from '../cards/transactions.service';
import { P2pController } from './p2p.controller';

@Module({
  providers: [P2pService, TransactionService, PrismaService],
  controllers: [P2pController],
})
export class P2pModule {}
