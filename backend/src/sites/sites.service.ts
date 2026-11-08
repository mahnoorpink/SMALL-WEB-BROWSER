import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from './schemas/site.schema';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<SiteDocument>) {}

  async findByAddress(address: string): Promise<Site> {
    const cleanAddress = address.toLowerCase().trim();
    const site = await this.siteModel.findOne({ address: cleanAddress }).exec();
    if (!site) {
      throw new NotFoundException(`Site with address '${address}' not found`);
    }
    return site;
  }

  async search(query: string): Promise<Site[]> {
    if (!query || query.trim() === '') return [];
    return this.siteModel
      .find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .exec();
  }

  async upsertSite(siteData: Partial<Site>): Promise<Site> {
    const cleanAddress = siteData.address?.toLowerCase().trim()
    return this.siteModel
      .findOneAndUpdate(
        { address: cleanAddress },
        { ...siteData, address: cleanAddress },
        { new: true, upsert: true }
      )
      .exec();
  }
}