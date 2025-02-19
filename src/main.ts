import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import Session from 'supertokens-node/recipe/session'
// supertokens.config.ts
import SuperTokens from 'supertokens-node'
import { middleware } from 'supertokens-node/framework/express'

export const initializeSuperTokens = () => {
  SuperTokens.init({
    appInfo: {
      apiDomain: 'http://localhost:3000',
      appName: 'Mi Startup',
      websiteDomain: 'http://localhost:4200',
    },
    recipeList: [Session.init({ getTokenTransferMethod: () => 'cookie' })],
  })
}

initializeSuperTokens()
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(middleware())
  app.enableCors({
    origin: true,
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
  .then(() => console.log('Server running'))
  .catch(console.error)
