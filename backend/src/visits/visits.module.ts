import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Visit, VisitSchema } from './schemas/visit.schema';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }])],
  providers: [VisitsService],
  controllers: [VisitsController],
  exports: [MongooseModule, VisitsService],
})
export class VisitsModule {}