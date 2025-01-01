// like.ts
import { Schema, model, Types } from 'mongoose';

interface LikeSchemaInterface {
	postId: Types.ObjectId;
	userId: Types.ObjectId;
}

const likeSchema = new Schema<LikeSchemaInterface>(
	{
		postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
		userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
	},
	{
		timestamps: true,
	}
);

// 중복 좋아요 방지를 위한 유니크 인덱스 설정
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const likeModel = model<LikeSchemaInterface>('Like', likeSchema);

export default likeModel;
