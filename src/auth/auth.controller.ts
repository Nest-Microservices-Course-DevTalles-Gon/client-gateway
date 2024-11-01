import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guard';
import { User } from './decorators';
import { CurrentUser } from './interfaces';
import { Token } from './decorators/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    // return this.client.send('auth.register.user', registerUserDto)
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError(err => { throw new RpcException(err) })
    )
    // return 'Register';
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @UseGuards(AuthGuard)
  @Get('verify')

  verifyUser(@User() user: CurrentUser, @Token() token: string) {
    return this.client.send('auth.verify.user', token)
  }

}
