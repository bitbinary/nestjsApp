import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  uid: string;
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: Date.now() })
  createdAt: Date;
  @Prop({ default: 0 })
  lockAttemptCount: number;
  @Prop({ default: Date.now() })
  lockExpiry: Date;
  @Prop({ default: null })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
// export const UserSchema = new Schema({
//   uid: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   lockAttemptCount: {
//     type: Number,
//     default: 0,
//   },
//   token: {
//     type: String,
//     default: null,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
//   lockExpiry: {
//     type: Date,
//     default: Date.now(),
//   },
// });
