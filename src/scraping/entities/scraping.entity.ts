import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core'
@Entity({
  tableName: 'scraping',
})
export class Scraping {
  @PrimaryKey({
    type: 'uuid',
    defaultRaw: 'uuid_generate_v4()',
  })
  id!: string

  @Index()
  @Property({
    type: 'text',
    nullable: false,
    index: true,
    columnType: 'text',
  })
  title!: string
}
