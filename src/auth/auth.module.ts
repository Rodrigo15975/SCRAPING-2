import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    JwtModule.register({
      secret: 'hard!to-guess_secret',
      signOptions: {
        expiresIn: '20m',
        algorithm: 'HS256',
        header: { alg: 'HS256' },
        subject: 'user',
      },
      verifyOptions: {
        algorithms: ['HS256'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
