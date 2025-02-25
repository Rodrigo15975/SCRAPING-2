import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'
@Entity({ tableName: 'scraping' })
export class Scraping {
  @PrimaryKey()
  uuid: string = v4()

  @Index()
  @Property({
    type: 'text',
    nullable: false,
    columnType: 'text',
  })
  title!: string

  @Property()
  img!: string
}
