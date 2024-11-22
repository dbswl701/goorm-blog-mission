// comment.ts
import { Schema, model, Types } from 'mongoose';

interface CommentSchemaInterface {
	postId: Types.ObjectId;
	author: Types.ObjectId;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const commentSchema = new Schema<CommentSchemaInterface>(
	{
		postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
		author: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
		content: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

// 인덱스 추가: 특정 게시글의 댓글을 빠르게 조회할 수 있도록
commentSchema.index({ postId: 1, createdAt: -1 });

const commentModel = model<CommentSchemaInterface>('Comment', commentSchema);

export default commentModel;
