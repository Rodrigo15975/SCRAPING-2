import { PlaywrightCrawler } from '@crawlee/playwright'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable, Logger } from '@nestjs/common'
import { CreateScrapingDto } from './dto/create-scraping.dto'
import { Scraping } from './entities/scraping.entity'
@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name)

  constructor(private readonly em: EntityManager) {}
  async create(createScrapingDto: CreateScrapingDto) {
    const scraping = this.em.create(Scraping, createScrapingDto)
    await this.em.persistAndFlush(scraping)
    return scraping
  }
  async scrapingIndeed() {
    const scraping = new PlaywrightCrawler({
      headless: false,
      launchContext: {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
      requestHandler: async ({ page }) => {
        const title = await page.title()

        console.log({
          title,
        })
      },
    })
    await scraping.run([
      {
        url: 'https://pe.indeed.com/?from=gnav-jobsearch--indeedmobile',
      },
    ])
    return {}
  }

  async findAllJobsLinkedin() {
    const crawler = new PlaywrightCrawler({
      launchContext: {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      },
      headless: true,
      requestHandler: async ({ page }) => {
        const allLinks = await page.$$('.f2_cp a')

        for (const link of allLinks) {
          // Escuchar si se abre una nueva página

          const [newPage] = await Promise.all([
            page.waitForEvent('popup'),
            link.click(),
          ]) // Espera que se abra una nueva pestaña

          await newPage.waitForLoadState() // Espera a que cargue la nueva página
          const title = await newPage.title() // Obtiene el título de la nueva página
          // const container = await newPage.$('.aec-image.pcBgImg_7e54cc08')
          const allImgs = await newPage.$$eval(
            '.aec-view.Wrapper_7e54cc08 .aec-image',
            (e) => ({
              img: e.map((img) => img.getAttribute('src')),
            }),
          )
          this.logger.debug({ allImgs })
          this.logger.debug({ title })

          await newPage.close() // Cierra la nueva pestaña
        }
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
