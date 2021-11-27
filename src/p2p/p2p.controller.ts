import { Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('/api/p2p')
export class P2pController {
  constructor(private readonly prisma: PrismaService) {}

  // @Post('/p2p/send')
  // async sendMoney()
}
