import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VisitDocument = Visit & Document;

@Schema({ timestamps: true })
export class Visit {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, lowercase: true, trim: true })
  address: string;

  @Prop({ required: true, enum: ['TYPED', 'LINK', 'JUMP', 'BACK_FORWARD'] })
  entryType: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);