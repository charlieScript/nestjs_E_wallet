import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Response,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { IHelperResponse } from 'src/helpers/response.interface';
import { AuthService } from '../auth/auth.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './users.service';

@Controller('/api/user')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  // login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return this.authService.login(req.user); // return jwt
  }

  @Post('signup')
  async signup(@Body() createDto: CreateUserDto): Promise<IHelperResponse> {
    // check for existing user
    const existingUser = await this.userService.findUserWithEmail({
      email: createDto.email,
    });
    if (existingUser) {
      return {
        success: false,
        status: 400,
        error: 'Invalid username and/or password.',
      };
    }

    const hashPassword = await hash(createDto.password, 10);

    await this.userService.createUser(createDto);
    const jwt = this.authService.login(createDto.email);
    return {
      success: true,
      status: 200,
      message: 'Account successfully created',
      data: { token: (await jwt).access_token },
    };
  }
}
