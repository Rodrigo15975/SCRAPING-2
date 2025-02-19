import { Controller, Get, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import CryptoJS from 'crypto-js'
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

    // Encriptar token antes de almacenarlo
    const encryptedRefreshToken = CryptoJS.AES.encrypt(
      refreshToken,
      'secretKey',
    )
    return {
      accessToken,
      refreshToken: encryptedRefreshToken,
    }

    // const tenantId = 'default' // ID del inquilino (puede ser una cadena predeterminada)
    // const userId = await Session.createNewSession()
    // return { message: 'Sesión creada correctamente' }
  }

  // @UseGuards(AuthGuard)
  @Post('logout')
  async logout() {
    // await Session.getSession(req.req, req.res).revokeSession()
    // return { message: 'Sesión cerrada' }
  }
}
