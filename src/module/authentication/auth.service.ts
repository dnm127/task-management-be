import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const users: any = await this.userService.getUserDataByUsername(username);
    const currentUser = users.length > 0 ? users[0] : {};
    const comparison = await compareSync(password, currentUser.password);
    if (currentUser.id && comparison) {
      const payload = { sub: currentUser.id, username: currentUser.username };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10m',
      });
      delete currentUser.password;
      return {
        accessToken,
        ...currentUser,
      };
    }
  }

  async getCurrentUser(token: string): Promise<any> {
    const isVerified = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    if (!isVerified) {
      return null;
    }
    const data = await this.jwtService.decode(token);
    if (data) {
      console.log('data', data);
      const user = await this.userService.findOneById(data.sub || '');
      return user && user.length > 0
        ? { ...user[0], accessToken: token }
        : null;
    } else {
      return null;
    }
  }
}
