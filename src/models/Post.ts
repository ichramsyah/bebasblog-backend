// src/models/Post.ts
import { Schema, model, Document, Types, Model } from 'mongoose';

export interface IPost extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  images: string[];
  description: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
}

const PostSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Menghubungkan ke model User
    },
    images: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = model<IPost>('Post', PostSchema);
export default Post;
