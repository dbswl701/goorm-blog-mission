import { Schema, model, Types, Document } from 'mongoose';

export interface PostSchema {
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

// 텍스트 인덱스
postSchema.index(
	{ title: 'text', contents: 'text' },
	{
		default_language: 'none', // 기본 언어를 한국어로 설정
		language_override: 'language', // 문서에서 언어 필드를 지정 (기본값: 'language')
		name: 'title_text_contents_text', // 인덱스 이름 지정
	}
);

const postModel = model<PostSchema>('Post', postSchema);

export default postModel;
