import { Controller, Get, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'crypto'

const PASSWORD = 'mi_clave_de_encriptacion' // Puede ser cualquier longitud
const SALT = 'un_salt_seguro' // Debe ser único y seguro
const KEY_LENGTH = 32 // 32 bytes para AES-256
const IV_LENGTH = 16 // 16 bytes para AES

// Derivar una clave de 32 bytes usando PBKDF2
const ENCRYPTION_KEY = crypto.pbkdf2Sync(
  PASSWORD,
  SALT,
  100000,
  KEY_LENGTH,
  'sha256',
)

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH) // Generar un IV aleatorio
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}` // Devolver IV y texto encriptado
}

export function decrypt(text: string): string {
  const [ivHex, encrypted] = text.split(':') // Separar IV y texto encriptado
  const iv = Buffer.from(ivHex, 'hex') // Convertir IV a Buffer
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}
  @Get('login')
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
      { expiresIn: '1d' },
    )
    const accessTokenEncrypted = encrypt(accessToken)

    const encryptedRefreshToken = encrypt(refreshToken)
    const decodedTokenRefresh = decrypt(encryptedRefreshToken)

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
