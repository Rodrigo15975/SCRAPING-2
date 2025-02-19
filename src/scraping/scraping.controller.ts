import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateScrapingDto } from './dto/create-scraping.dto'
import { ScrapingService } from './scraping.service'

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post()
  create(@Body() createScrapingDto: CreateScrapingDto) {
    return this.scrapingService.create(createScrapingDto)
  }

  @Get()
  findAll() {
    return this.scrapingService.findAllJobsLinkedin()
  }
}
