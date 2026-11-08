import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './schemas/site.schema';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }])],
  providers: [SitesService],
  controllers: [SitesController],
  exports: [MongooseModule, SitesService],
})
export class SitesModule {}