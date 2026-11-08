import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SitesModule } from './sites/sites.module'
import { VisitsModule } from './visits/visits.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seeds/seed.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    SitesModule,
    VisitsModule,
    UsersModule,
    SeedModule
  ],
})
export class AppModule {}