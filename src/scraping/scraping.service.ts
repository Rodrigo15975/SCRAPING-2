import { PlaywrightCrawler } from '@crawlee/playwright'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CreateScrapingDto } from './dto/create-scraping.dto'
import { Scraping } from './entities/scraping.entity'
// import { KeyValueStore } from 'crawlee'
export const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
]

@Injectable()
export class ScrapingService {
  constructor(private readonly em: EntityManager) {}
  async create(createScrapingDto: CreateScrapingDto) {
    const scraping = this.em.create(Scraping, createScrapingDto)
    await this.em.persistAndFlush(scraping)
    return scraping
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
      useSessionPool: true, // Evita problemas de sesión
    })

    // Add first URL to the queue and start the crawl.
    await crawler.run([
      {
        url: 'https://www.amazon.com/s?k=computers',
        uniqueKey: `computers:${Date.now()}`,
      },
    ])
    return {}
  }

  // async findAll() {
  //   const dataScraping: any[] = []
  //   const store = await KeyValueStore.open('scraping-store')
  //   const values = await store.getValue('scraping')
  //   console.log(values)

  //   const scraping = new PlaywrightCrawler({
  //     launchContext: {
  //       launchOptions: {
  //         headless: true,
  //       },
  //       userAgent:
  //         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  //     },
  //     requestHandler: async ({ page, request }) => {
  //       await store.setValue('scraping', {
  //         title: await page.title(),
  //         url: request.url,
  //       })
  //       dataScraping.push({
  //         title: await page.title(),
  //         url: request.url,
  //       })

  //       console.log({
  //         store,
  //         values,
  //         title: await page.title(),
  //         url: request.url,
  //       })
  //       console.log(`Scraping: ${request.url}`)
  //     },
  //     maxRequestsPerCrawl: 1,
  //     headless: true,
  //     persistCookiesPerSession: false,
  //     useSessionPool: true,
  //     maxConcurrency: 1,
  //   })
  //   await scraping.run(['https://www.amazon.com/s?k=computers'])
  //   return {
  //     dataScraping,
  //   }
  // }
}
