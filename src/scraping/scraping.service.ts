import { PlaywrightCrawler } from '@crawlee/playwright'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { CreateScrapingDto } from './dto/create-scraping.dto'
import { Scraping } from './entities/scraping.entity'

// import {
//   SecretsManagerClient,
//   GetSecretValueCommand,
// } from '@aws-sdk/client-secrets-manager'

@Injectable()
export class ScrapingService implements OnModuleInit {
  // private readonly client = new SecretsManagerClient({
  //   region: 'us-east-1',
  // })
  private readonly logger = new Logger(ScrapingService.name)
  onModuleInit() {
    //   const command = new GetSecretValueCommand({
    //     SecretId: process.env.SECRET_ID,
  }

  //   const response = await this.client.send(command)
  //   this.logger.debug({
  //     response,
  //   })
  // }
  constructor(private readonly em: EntityManager) {}
  async create(createScrapingDto: CreateScrapingDto) {
    const scraping = this.em.create(Scraping, createScrapingDto)
    await this.em.persistAndFlush(scraping)
    return scraping
  }

  async findAllJobsLinkedin() {
    const crawler = new PlaywrightCrawler({
      launchContext: {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      },
      headless: true,
      requestHandler: async ({ page }) => {
        // await page.waitForTimeout(10000)
        // await page.waitForSelector('.f2_cp', { state: 'visible' })
        const allLinks = await page.$$('.f2_cp a')
        for (const link of allLinks) {
          await link.click()
          await page.waitForTimeout(8000)
          await page.waitForSelector('.aec-view productSliderList_6a40c3cf', {
            state: 'visible',
          })
          const containers = await page.$$(
            '.aec-view productSliderList_6a40c3cf',
          )
          this.logger.debug({
            containers,
          })
        }
        // const links = await page.$$eval('.f2_cp a', (el) =>
        //   el.map((e) => ({
        //     hrfe: e.getAttribute('href'),
        //   })),
        // )
        // ak_ap
      },
      maxRequestsPerCrawl: 1,
    })

    await crawler.run([
      {
        url: 'https://es.aliexpress.com/?gatewayAdapt=glo2esp',
      },
    ])
    return {}
  }

  async findAll() {
    const crawler = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
        },
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      async requestHandler({ page }) {
        await page.waitForSelector('.a-price-whole', {
          timeout: 20000,
          state: 'visible',
        })
        const price = await page.locator('.a-price-whole').first().textContent()
        const allPrices = await page.locator('.a-price-whole').allTextContents()
        console.log({
          price,
          allPrices,
        })
      },

      headless: true,
      maxRequestsPerCrawl: 5,
      persistCookiesPerSession: false,
      useSessionPool: true,
    })

    await crawler.run([
      {
        url: 'https://www.amazon.com/s?k=computers',
        uniqueKey: `computers:${Date.now()}`,
      },
    ])
    return {}
  }
}
