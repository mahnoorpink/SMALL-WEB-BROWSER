import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SiteDocument = Site & Document;

@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  address: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  bodyHtml: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  authorId: MongooseSchema.Types.ObjectId;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

// MongoDB Full-Text Search across Title and Content
SiteSchema.index({ title: 'text', bodyHtml: 'text' });