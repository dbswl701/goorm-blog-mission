import { Schema, model, Types, Document } from 'mongoose';

interface PostSchema {
	title: string;
	author: Types.ObjectId;
	contents: string;
	createdAt: Date;
	updatedAt: Date;
}

const postSchema = new Schema<PostSchema>(
	{
		title: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
		contents: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const postModel = model<PostSchema>('Post', postSchema);

export default postModel;
