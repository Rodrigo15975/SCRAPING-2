import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { encrypt } from './auth.controller'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login() {
    const accessToken = await this.jwtService.signAsync(
      {
        user_id: '79ca7167-57ca-40ee-8cc1-64f2e3210c2d',
        email: 'rodrigorumpler@gmail.com',
        subscription: {
          name: 'FREE',
          subscription_id: '3735a629-f091-4c15-979d-cadf08436e0d',
        },
        roles: [
          {
            name: 'USER',
            role_id: 1,
          },
        ],
      },
      { expiresIn: '15m' },
    )
    const refreshToken = await this.jwtService.signAsync(
      {
        user_id: '79ca7167-57ca-40ee-8cc1-64f2e3210c2d',
        email: 'rodrigorumpler@gmail.com',
        subscription: {
          name: 'FREE',
          subscription_id: '3735a629-f091-4c15-979d-cadf08436e0d',
        },
        roles: [
          {
            name: 'USER',
            role_id: 1,
          },
        ],
      },
      { expiresIn: '15m' },
    )
    const tokenEncrypted = encrypt(accessToken)
    const refreshTokenEncrypted = encrypt(refreshToken)
    return {
      accessToken: tokenEncrypted,
      refreshToken: refreshTokenEncrypted,
    }
  }
  async logout() {}
}
