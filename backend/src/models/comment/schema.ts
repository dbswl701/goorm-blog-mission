// comment.ts
import { Schema, model, Types } from 'mongoose';

interface CommentSchemaInterface {
	post: Types.ObjectId;
	author: Types.ObjectId;
	content: string;
}

const commentSchema = new Schema<CommentSchemaInterface>(
	{
		post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
		author: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
		content: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const commentModel = model<CommentSchemaInterface>('Comment', commentSchema);

export default commentModel;
