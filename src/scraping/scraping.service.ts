import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable, Logger } from '@nestjs/common'
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
      requestHandler: async ({ page }) => {
        const title = await page.title()
        Logger.debug(`Title is '${title}'`)
      },
      maxRequestsPerCrawl: 1,
    })
    await scraping.run(['https://crawlee.dev'])
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
