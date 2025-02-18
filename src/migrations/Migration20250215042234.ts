import { Migration } from '@mikro-orm/migrations'

export class Migration20250215042234 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "scraping" alter column "uuid" type text using ("uuid"::text);`,
    )

    this.addSql(`alter table "scraping" alter column "uuid" drop default;`)
    this.addSql(
      `alter table "scraping" alter column "uuid" type varchar(255) using ("uuid"::varchar(255));`,
    )
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "scraping" alter column "uuid" drop default;`)
    this.addSql(
      `alter table "scraping" alter column "uuid" type uuid using ("uuid"::text::uuid);`,
    )
    this.addSql(
      `alter table "scraping" alter column "uuid" set default gen_random_uuid();`,
    )
  }
}
