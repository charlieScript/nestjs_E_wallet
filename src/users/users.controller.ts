import { Controller, Post, Body, Res } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { Response } from 'express';
// import { IHelperResponse } from 'src/helpers/response.interface';
import { AuthService } from '../auth/auth.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './users.service';

@Controller('/api/user')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  // login
  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    // check for existing user
    const existingUser = await this.userService.findUserWithEmail({
      email: loginDto.email,
    });

    if (existingUser) {
      const jwt = this.authService.login(loginDto);
      const passwordChecker = await compare(
        loginDto.password,
        existingUser.password,
      );

      if (passwordChecker) {
        return {
          success: true,
          status: 200,
          message: 'Account successfully logged in',
          data: { token: (await jwt).access_token },
        };
      } else {
        res.status(400).json({
          success: false,
          status: 400,
          error: 'Invalid username and/or password.',
        });
      }
    } else {
      res.status(400).json({
        success: false,
        status: 400,
        error: 'Invalid username and/or password.',
      });
    }
  }

  @Post('signup')
  async signup(
    @Body() createDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      // check for existing user
      const existingUser = await this.userService.findUserWithEmail({
        email: createDto.email,
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          status: 400,
          error: 'Account Already Exists',
        });
        return;
      }

      const hashPassword = await hash(createDto.password, 10);

      const newUser = await this.userService.createUser({
        email: createDto.email,
        first_name: createDto.first_name,
        last_name: createDto.last_name,
        password: hashPassword,
      });
      await this.userService.createAccount({
        user_id: newUser.email,
        balance: 0.0,
      });
      const jwt = this.authService.login(createDto);
      return {
        success: true,
        status: 200,
        message: 'Account successfully created',
        data: { token: (await jwt).access_token },
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
}
