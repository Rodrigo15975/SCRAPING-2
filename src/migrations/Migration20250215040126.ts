import { Migration } from '@mikro-orm/migrations';

export class Migration20250215040126 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "scraping" ("id" uuid not null default uuid_generate_v4(), "title" text not null, constraint "scraping_pkey" primary key ("id"));`);
    this.addSql(`create index "scraping_title_index" on "scraping" ("title");`);
    this.addSql(`create index "scraping_title_index" on "scraping" ("title");`);
  }

}
