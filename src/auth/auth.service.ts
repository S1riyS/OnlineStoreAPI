import { Injectable } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  login(dto: LoginDto) {
    return 'logged in ' + dto.email;
  }

  signup(dto: SignupDto) {
    return 'signed up ' + dto.email;
  }
}
