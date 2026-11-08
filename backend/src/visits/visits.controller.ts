import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get()
  getHistory(@Query('userId') userId: string) {
    return this.visitsService.getHistoryByUser(userId);
  }

  @Post()
  logVisit(@Body() body: { userId: string; address: string; entryType: string }) {
    return this.visitsService.logVisit(body.userId, body.address, body.entryType);
  }
}