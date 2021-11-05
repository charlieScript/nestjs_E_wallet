import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// import { transactions, Prisma } from '@prisma/client';
import * as crypto from 'crypto';

const ref = crypto
  .createHash('sha256')
  .update(crypto.randomBytes(10))
  .digest('hex');

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async creditAccount(
    amount: number,
    account_id: string,
    purpose: any,
    metadata: any,
  ): Promise<any> {
    const account = await this.prisma.accounts.findFirst({
      where: {
        user_id: account_id,
      },
    });

    if (!account) {
      return {
        success: false,
        message: 'Account does not exist',
      };
    }

    await this.prisma.accounts.update({
      where: {
        user_id: account.user_id,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    await this.prisma.transactions.create({
      data: {
        amount,
        purpose,
        txn_type: 'credit',
        account_id: account.user_id,
        reference: ref,
        metadata,
        balance_before: account.balance,
        balance_after: Number(account.balance) + Number(amount),
      },
    });

    return {
      success: true,
      message: 'Credit successful',
    };
  }

  async debitAccount(
    amount: number,
    account_id: string,
    purpose: any,
    metadata: any,
  ): Promise<any> {
    const account = await this.prisma.accounts.findFirst({
      where: {
        user_id: account_id,
      },
    });

    if (!account) {
      return {
        success: false,
        message: 'Account does not exist',
      };
    }
    if (Number(account.balance) < amount) {
      return {
        success: false,
        message: 'Insufficient balance',
      };
    }

    await this.prisma.accounts.update({
      where: {
        user_id: account.user_id,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    await this.prisma.transactions.create({
      data: {
        amount,
        purpose,
        txn_type: 'debit',
        account_id: account.user_id,
        reference: ref,
        metadata,
        balance_before: account.balance,
        balance_after: Number(account.balance) - Number(amount),
      },
    });

    return {
      success: true,
      message: 'Debit successful',
    };
  }
}
