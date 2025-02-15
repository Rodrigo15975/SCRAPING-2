import { EntityManager, MikroORM } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CreateScrapingDto } from './dto/create-scraping.dto'
import { UpdateScrapingDto } from './dto/update-scraping.dto'
import { Scraping } from './entities/scraping.entity'

@Injectable()
export class ScrapingService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}
  async create(createScrapingDto: CreateScrapingDto) {
    const scraping = this.em.create(Scraping, createScrapingDto)
    await this.em.persistAndFlush(scraping)
    return scraping
  }

  findAll() {
    return `This action returns all scraping`
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
