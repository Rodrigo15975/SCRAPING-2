import { PlaywrightCrawler } from '@crawlee/playwright'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable, Logger } from '@nestjs/common'
import { CreateScrapingDto } from './dto/create-scraping.dto'
import { Scraping } from './entities/scraping.entity'
// import * as CryptoJS from 'crypto-js'
// import { KeyValueStore } from 'crawlee'

@Injectable()
export class ScrapingService {
  readonly logger = new Logger(ScrapingService.name)

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
      headless: false,
      requestHandler: async ({ page }) => {
        await page.waitForSelector('.MuiCard-root', {
          timeout: 20000,
        })
        // const selectors = ['order-item-content-img']

        // const description = await page
        //   .locator('.MuiCard-root p')
        //   .allTextContents()
        // const ubication = await page
        //   .locator('.MuiCardActions-root span')
        //   .allTextContents()
        // const time = await page
        //   .locator('.MuiCardActions-root p')
        //   .allTextContents()

        // console.log({ titles, description, ubication, time })
      },
      maxRequestsPerCrawl: 1,
    })

    await crawler.run([
      {
        url: 'https://www.aliexpress.com/p/order/index.html',
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
