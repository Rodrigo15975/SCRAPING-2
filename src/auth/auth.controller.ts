import { Controller, Get, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as CryptoJS from 'crypto-js'

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}
  @Get('login')
  async login() {
    const accessToken = await this.jwtService.signAsync(
      { sub: 1 },
      { expiresIn: '15m' },
    )
    const refreshToken = await this.jwtService.signAsync(
      { sub: 1 },
      { expiresIn: '1d' },
    )
    const accessTokenEncrypted = CryptoJS.AES.encrypt(
      accessToken,
      'secretKey',
      {
        format: CryptoJS.format.OpenSSL,
      },
    )
    const encryptedRefreshToken = CryptoJS.AES.encrypt(
      refreshToken,
      'secretKey',
    ).toString()
    const decodedTokenRefresh = CryptoJS.AES.decrypt(
      encryptedRefreshToken,
      'secretKey',
    ).toString(CryptoJS.enc.Utf8)

    return {
      decodedTokenRefresh,
      accessTokenEncrypted,
      encryptedRefreshToken,
    }
  }

  // @UseGuards(AuthGuard)
  @Post('logout')
  async logout() {
    // await Session.getSession(req.req, req.res).revokeSession()
    // return { message: 'Sesión cerrada' }
  }
}
