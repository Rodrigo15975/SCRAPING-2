import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Logger } from '@nestjs/common'
import * as dotenv from 'dotenv'
dotenv.config()

const logger = new Logger('MikroORM')
logger.debug('Loading MikroORM configuration...')
logger.debug('DATABASE_URL', process.env.DATABASE_URL)

export default defineConfig({
  dbName: 'neondb',
  debug: true,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: process.env.DATABASE_URL,
  logger: (message) => logger.log(message),
  driverOptions: {
    connection: {
      ssl: true,
    },
    ssl: {
      rejectUnauthorized: false,
      sslmode: 'require',
    },
  },
  driver: PostgreSqlDriver,
})
