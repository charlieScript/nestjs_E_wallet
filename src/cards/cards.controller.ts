import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CardsService } from './cards.service';
import { CardDto } from './dto/card.dto';
import { OTPDto, PhoneDto, PINDto } from './dto/misc-data.dto';

@Controller('/api/card')
export class CardsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cardService: CardsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/charge')
  async chargeCard(@Body() card: CardDto): Promise<any> {
    // 1. charge card
    try {
      await this.prisma.$transaction(async () => {
        const result = await this.cardService.chargeCard(
          {
            number: card.number,
            cvv: card.cvv,
            expiry_year: card.expiry_year,
            expiry_month: card.expiry_month,
          },
          card.email,
          card.amount,
        );
        // console.log(result, 'from controller');
        if (result.nextAction === 'success') {
          return {
            success: true,
            message: result.message,
            txn_ref: result.txn_ref,
            extra_details: `${card.amount} was paid into ${card.email} account`,
          };
        }
        if (result.data.data.status === 'send_pin') {
          return {
            success: false,
            status: 200,
            message: 'Funding Failed Send Pin with payload and the reference',
            reference: result.data.data.reference,
          };
        }

        if (!result) {
          return {
            success: true,
            status: 200,
            message: 'Funding failed',
          };
        }
      });
      // return {
      //   ...res,
      // };
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        status: 400,
        error: 'charge not successful',
      };
    }
  }

  @Post('/charge/send_pin')
  async sendPin(@Body() reference: PINDto): Promise<any> {
    // 1. charge card
    try {
      await this.prisma.$transaction(async () => {
        const result = await this.cardService.submitPIN(
          reference.ref,
          reference.pin,
        );
        if (result.data.data.status === 'send_otp') {
          return {
            success: false,
            status: 200,
            message: 'Funding Failed Send OTP with payload and the reference',
            reference: result.data.data.reference,
          };
        }

        if (!result?.success) {
          return {
            success: true,
            status: 200,
            message: 'Funding failed',
          };
        }
      });
      // return {
      //   ...res,
      // };
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        status: 400,
        error: 'charge not successful',
      };
    }
  }

  @Post('/charge/send_pin')
  async sendOtp(@Body() reference: OTPDto): Promise<any> {
    // 1. charge card
    try {
      await this.prisma.$transaction(async () => {
        const result = await this.cardService.submitPIN(
          reference.ref,
          reference.otp,
        );
        if (result.data.data.status === 'send_phone') {
          return {
            success: false,
            status: 200,
            message: 'Funding Failed Send OTP with payload and the reference',
            reference: result.data.data.reference,
          };
        }

        if (!result?.success) {
          return {
            success: true,
            status: 200,
            message: 'Funding failed',
          };
        }
      });
      // return {
      //   ...res,
      // };
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        status: 400,
        error: 'charge not successful',
      };
    }
  }

  @Post('/charge/send_pin')
  async sendPhone(@Body() reference: PhoneDto): Promise<any> {
    // 1. charge card
    try {
      await this.prisma.$transaction(async () => {
        const result = await this.cardService.submitPIN(
          reference.ref,
          reference.phone,
        );

        if (!result?.success) {
          return {
            success: true,
            status: 200,
            message: 'Funding failed',
          };
        }
      });
      // return {
      //   ...res,
      // };
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        status: 400,
        error: 'charge not successful',
      };
    }
  }
}
