import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CreateScrapingDto } from './dto/create-scraping.dto'
import { UpdateScrapingDto } from './dto/update-scraping.dto'
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
    const scraping = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
        },
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      requestHandler: async ({ page }) => {
        await page.waitForSelector('.ja_f', {
          timeout: 10000,
          state: 'visible',
        })
        const listOrders = await page.$$eval('.ja_f', (e) =>
          e.map((el) => ({
            img: el.querySelector('img')?.getAttribute('src'),
          })),
        )
        console.log({
          listOrders,
        })
      },
      maxRequestsPerCrawl: 1,
      headless: true,
    })
    await scraping.run([
      'https://es.aliexpress.com/?spm=a2g0o.order_list.logo.1.21ef194dbYGdea',
    ])
    const data = await scraping.getData()
    return {
      data,
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} scraping`
  }

  update(id: number, updateScrapingDto: UpdateScrapingDto) {
    console.log(updateScrapingDto)

    return `This action updates a #${id} scraping`
  }

  remove(id: number) {
    return `This action removes a #${id} scraping`
  }
}
