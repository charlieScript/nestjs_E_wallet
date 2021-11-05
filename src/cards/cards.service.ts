import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma.service';
import { TransactionService } from './transactions.service';

interface CardObject {
  number: number;
  cvv: number;
  expiry_year: number;
  expiry_month: number;
}

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private transactionsService: TransactionService,
  ) {}

  private readonly BASE_API = 'https://api.paystack.co/charge';
  private readonly BEARER_TOKEN = process.env.paystack_token;

  async fundAccount(
    card: CardObject,
    email: string,
    amount: number,
    pin: number,
    otp: number,
    phone: number,
  ): Promise<any> {
    try {
      return await this.prisma.$transaction(async () => {
        const result = await this.chargeCard(card, email, amount);
        if (result?.nextAction === 'send_pin') {
          await this.submitPIN(result.txn_ref, pin);
        }
        if (result?.nextAction === 'send_otp') {
          await this.submitOtp(result.txn_ref, otp);
        }
        if (result?.nextAction === 'send_phone') {
          await this.submitPhone(result.txn_ref, phone);
        }
      });
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async chargeCard(
    card: CardObject,
    email: string,
    amount: number,
  ): Promise<any> {
    try {
      const charge = await axios.post(
        this.BASE_API,
        {
          email,
          amount,
          card,
        },
        {
          headers: {
            Authorization: `Bearer ${this.BEARER_TOKEN}`,
          },
        },
      );

      // successful charge card
      if (charge.data.data.status === 'success') {
        await this.prisma.$transaction(async (prisma) => {
          // console.log(charge);

          const txn = await prisma.card_transactions.create({
            data: {
              account_id: email,
              amount: amount,
              external_reference: charge.data.data.reference,
              last_response: charge.data.data.status,
            },
          });

          const creditResult = await this.transactionsService.creditAccount(
            amount,
            email,
            'card_funding',
            charge.data.data,
          );

          if (!creditResult.success) {
            return {
              success: false,
              error: 'Could not credit account',
              txn_ref: txn.external_reference,
              nextAction: txn.last_response,
            };
          }
          return {
            success: true,
            message: 'Charge successful',
            txn_ref: txn.external_reference,
            nextAction: txn.last_response,
          };
        });
      } else {
        return {
          data: charge.data,
        };
      }
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        message: 'Charge not successful an error happened',
      };
    }
  }

  async submitPIN(reference: string, pin: number | undefined): Promise<any> {
    try {
      const transaction = await this.prisma.card_transactions.findFirst({
        where: {
          external_reference: reference,
        },
      });

      if (!transaction) {
        return {
          success: true,
          message: 'Transaction not found',
        };
      }

      if (transaction?.last_response === 'success') {
        return {
          success: true,
          message: 'Transaction already succeeded',
        };
      }

      const charge = await axios.post(
        `${this.BASE_API}/submit_pin`,
        {
          reference,
          pin,
        },
        {
          headers: {
            Authorization: `Bearer ${this.BEARER_TOKEN}`,
          },
        },
      );

      if (charge.data.data.status === 'success') {
        await this.prisma.$transaction(async (prisma) => {
          await prisma.card_transactions.update({
            where: {
              external_reference: transaction.external_reference,
            },
            data: {
              last_response: charge.data.data.status,
            },
          });
          const creditResult = await this.transactionsService.creditAccount(
            Number(transaction.amount),
            transaction.account_id,
            'card_funding',
            charge.data.data,
          );
          if (!creditResult.success) {
            return {
              success: false,
              error: 'Could not credit account',
              txn_ref: transaction.external_reference,
              nextAction: transaction.last_response,
            };
          }
        });
        return {
          success: true,
          message: 'Charge successful',
          txn_ref: transaction.external_reference,
          nextAction: transaction.last_response,
        };
      }
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        message: 'Charge not successful an error happened',
      };
    }
  }

  async submitOtp(reference: string, otp: number | undefined): Promise<any> {
    try {
      const transaction = await this.prisma.card_transactions.findFirst({
        where: {
          external_reference: reference,
        },
      });

      if (!transaction) {
        return {
          success: true,
          message: 'Transaction not found',
        };
      }

      if (transaction?.last_response === 'success') {
        return {
          success: true,
          message: 'Transaction already succeeded',
        };
      }

      const charge = await axios.post(
        `${this.BASE_API}/submit_otp`,
        {
          reference,
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${this.BEARER_TOKEN}`,
          },
        },
      );

      if (charge.data.data.status === 'success') {
        await this.prisma.$transaction(async (prisma) => {
          await prisma.card_transactions.update({
            where: {
              external_reference: transaction.external_reference,
            },
            data: {
              last_response: charge.data.data.status,
            },
          });
          const creditResult = await this.transactionsService.creditAccount(
            Number(transaction.amount),
            transaction.account_id,
            'card_funding',
            charge.data.data,
          );
          if (!creditResult.success) {
            return {
              success: false,
              error: 'Could not credit account',
              txn_ref: transaction.external_reference,
              nextAction: transaction.last_response,
            };
          }
        });
        return {
          success: true,
          message: 'Charge successful',
          txn_ref: transaction.external_reference,
          nextAction: transaction.last_response,
        };
      }
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        message: 'Charge not successful an error happened',
      };
    }
  }

  async submitPhone(
    reference: string,
    phone: number | undefined,
  ): Promise<any> {
    try {
      const transaction = await this.prisma.card_transactions.findFirst({
        where: {
          external_reference: reference,
        },
      });

      if (!transaction) {
        return {
          success: true,
          message: 'Transaction not found',
        };
      }

      if (transaction?.last_response === 'success') {
        return {
          success: true,
          message: 'Transaction already succeeded',
        };
      }

      const charge = await axios.post(
        `${this.BASE_API}/submit_phone`,
        {
          reference,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${this.BEARER_TOKEN}`,
          },
        },
      );

      if (charge.data.data.status === 'success') {
        await this.prisma.$transaction(async (prisma) => {
          await prisma.card_transactions.update({
            where: {
              external_reference: transaction.external_reference,
            },
            data: {
              last_response: charge.data.data.status,
            },
          });
          const creditResult = await this.transactionsService.creditAccount(
            Number(transaction.amount),
            transaction.account_id,
            'card_funding',
            charge.data.data,
          );
          if (!creditResult.success) {
            return {
              success: false,
              error: 'Could not credit account',
              txn_ref: transaction.external_reference,
              nextAction: transaction.last_response,
            };
          }
        });
        return {
          success: true,
          message: 'Charge successful',
          txn_ref: transaction.external_reference,
          nextAction: transaction.last_response,
        };
      }
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        message: 'Charge not successful an error happened',
      };
    }
  }
}
