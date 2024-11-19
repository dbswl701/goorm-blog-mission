// like.ts
import { Schema, model, Types } from 'mongoose';

interface LikeSchemaInterface {
	post: Types.ObjectId;
	user: Types.ObjectId;
}

const likeSchema = new Schema<LikeSchemaInterface>(
	{
		post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
	},
	{
		timestamps: true,
	}
);

// 중복 좋아요 방지를 위한 유니크 인덱스 설정
likeSchema.index({ post: 1, user: 1 }, { unique: true });

const likeModel = model<LikeSchemaInterface>('Like', likeSchema);

export default likeModel;
