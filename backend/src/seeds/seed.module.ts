import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Site, SiteSchema } from '../sites/schemas/site.schema';
import { Visit, VisitSchema } from '../visits/schemas/visit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Site.name, schema: SiteSchema },
      { name: Visit.name, schema: VisitSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}