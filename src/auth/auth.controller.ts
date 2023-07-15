import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  signupLocal(@Body() dto: SignupDto) {
    return this.authService.signupLocal(dto);
  }

  @Post('local/login')
  loginLocal(@Body() dto: LoginDto) {
    return this.authService.loginLocal(dto);
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/refresh')
  refresh() {
    return this.authService.logout();
  }
}
