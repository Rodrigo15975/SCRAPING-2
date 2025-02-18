import { Migration } from '@mikro-orm/migrations'

export class Migration20250215041026 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "scraping" drop constraint "scraping_pkey";`)
    this.addSql(`alter table "scraping" drop column "id";`)

    this.addSql(
      `alter table "scraping" add column "uuid" uuid not null default gen_random_uuid();`,
    )
    this.addSql(
      `alter table "scraping" add constraint "scraping_pkey" primary key ("uuid");`,
    )
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "scraping" drop constraint "scraping_pkey";`)
    this.addSql(`alter table "scraping" drop column "uuid";`)

    this.addSql(
      `alter table "scraping" add column "id" uuid not null default uuid_generate_v4();`,
    )
    this.addSql(
      `alter table "scraping" add constraint "scraping_pkey" primary key ("id");`,
    )
  }
}
