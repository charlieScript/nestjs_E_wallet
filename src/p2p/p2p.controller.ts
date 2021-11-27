import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/users.service';
import { p2pDto } from './dto/p2p.dto';
import { Response } from 'express';
import { TransactionService } from '../cards/transactions.service';

@Controller('/api/p2p')
export class P2pController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly transanctionService: TransactionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/send')
  async sendMoney(
    @Body() p2p: p2pDto,
    @Req() req,
    @Res() res: Response,
  ): Promise<any> {
    if (req.user.email === p2p.reciever) {
      return new BadRequestException();
    }
    try {
      // await this.prisma.$transaction(async () => {
      const senderAcc = await this.userService.findUserWithEmail(
        req.user.email,
      );
      const recieverAcc = await this.userService.findUserWithEmail(
        p2p.reciever,
      );
      if (!recieverAcc && !senderAcc) {
        return {
          success: false,
          status: 400,
          error: 'an error occurred',
        };
      }
      const debit = await this.transanctionService.debitAccount(
        p2p.amount,
        req.user.email,
        'transfer',
        `${p2p.amount} was removed from ${senderAcc?.email}`,
      );
      if (debit.success) {
        const credit = await this.transanctionService.creditAccount(
          p2p.amount,
          recieverAcc.email,
          'transfer',
          `${p2p.amount} was sent from ${recieverAcc?.email} from ${senderAcc.email}`,
        );
        res.status(200).json(credit);
      } else {
        res.status(200).json(debit);
      }

      // });
    } catch (error) {
      console.log(error);
      return {
        success: false,
        status: 400,
        error: 'transaction failed not successful',
      };
    }
  }
}
