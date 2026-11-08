import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.sitesService.search(query);
  }

  @Get(':address')
  findByAddress(@Param('address') address: string) {
    return this.sitesService.findByAddress(address);
  }

  @Post()
  createOrUpdate(@Body() siteData: any) {
    return this.sitesService.upsertSite(siteData);
  }
}