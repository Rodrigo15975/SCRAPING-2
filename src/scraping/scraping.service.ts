import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CreateScrapingDto } from './dto/create-scraping.dto'
import { Scraping } from './entities/scraping.entity'
import { PlaywrightCrawler } from 'crawlee'
@Injectable()
export class ScrapingService {
  constructor(private readonly em: EntityManager) {}
  async create(createScrapingDto: CreateScrapingDto) {
    const scraping = this.em.create(Scraping, createScrapingDto)
    await this.em.persistAndFlush(scraping)
    return scraping
  }

  async findAll() {
    const dataScraping: any[] = []

    const scraping = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
        },
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      requestHandler: async ({ page, request }) => {
        console.log({
          title: await page.title(),
          url: request.url,
        })
        console.log(`Scraping: ${request.url}`)
      },
      maxRequestsPerCrawl: 1,
      headless: true,
      persistCookiesPerSession: false,
      useSessionPool: false,
    })
    await scraping.run(['https://www.amazon.com/s?k=computers'])
    return {
      dataScraping,
    }
  }
}
