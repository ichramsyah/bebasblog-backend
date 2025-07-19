// src/models/Comment.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId; // Post yang dikomentari
  user: Types.ObjectId; // User yang berkomentar
  content: string;
}

const CommentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model<IComment>('Comment', CommentSchema);
export default Comment;
