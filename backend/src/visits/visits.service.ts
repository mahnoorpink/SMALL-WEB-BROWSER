import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema';

@Injectable()
export class VisitsService {
  constructor(@InjectModel(Visit.name) private visitModel: Model<VisitDocument>) {}

  async logVisit(userId: string, address: string, entryType: string): Promise<Visit> {
    const visit = new this.visitModel({
      userId,
      address: address.toLowerCase().trim(),
      entryType,
    });
    return visit.save();
  }

  async getHistoryByUser(userId: string): Promise<Visit[]> {
       return this.visitModel
      .find({ userId: userId as any})
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }
}