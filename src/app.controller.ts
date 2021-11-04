import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // login
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // login(@Request() req): any {
  //   return this.authService.login(req.user); // return jwt
  // }

  // @UseGuards(AuthenticatedGuard) // for sesions only
  // @UseGuards(JwtAuthGuard)
  @Get('/')
  getHello(): any {
    return {
      message: 'Welcome to Nexus E wallet',
    };
  }
}
