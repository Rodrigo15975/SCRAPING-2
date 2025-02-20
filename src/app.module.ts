import { MikroOrmModule } from '@mikro-orm/nestjs'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Module } from '@nestjs/common'
import { ScrapingModule } from './scraping/scraping.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot({
      clientUrl: process.env.DATABASE_URL,
      dbName: 'neondb',
      forceUtcTimezone: true,
      debug: true,
      migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
        glob: '!(*.d).{js,ts}',
      },
      entities: ['dist/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
      autoLoadEntities: true,
      driver: PostgreSqlDriver,
      driverOptions: {
        connection: {
          ssl: true,
        },
        ssl: {
          rejectUnauthorized: false,
          sslmode: 'require',
        },
      },
    }),
    ScrapingModule,
    // AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
