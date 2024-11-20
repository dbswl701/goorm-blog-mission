import mongoose from 'mongoose';
import Post from './schema';
import { PostInterface } from '../../types';

export const transformUser = (post: any): PostInterface => {
	const { _id, author, ...rest } = post;

	return {
		...rest,
		id: _id.toString(),
		author: author.username,
	};
};

export const getPostById = async (
	id: string
): Promise<PostInterface | null> => {
	if (!id || typeof id !== 'string') {
		throw new Error('Invalid id');
	}

	const result = await Post.findOne(
		{ _id: new mongoose.Types.ObjectId(id) },
		{ __v: 0 }
	)
		.populate('author', 'username')
		.lean()
		.exec();

	if (!result) {
		return null;
	}

	return transformUser(result);
};

// export const getAllPosts = async ({
// 	summary = false,
// }: {
// 	summary: boolean;
// }): Promise<PostInterface[] | null> => {
// 	if (typeof summary !== 'boolean') {
// 		throw new Error('Invalid summary');
// 	}

// 	const posts = await Post.find({}, { __v: 0 })
//     	.sort({ _id: -1 })
// 		.populate('author', 'username')
// 		.lean()
// 		.exec();

// 	if (!posts) {
// 		return null;
// 	}

// 	const result = posts.map((post) => transformUser(post));

// 	return result;
// };

// 실제 게시글을 데이터베이스에서 가져오는 함수 수정
export const getAllPosts = async ({
	summary = false,
	page = 1,
	limit = 10,
}: {
	summary: boolean;
	page: number;
	limit: number;
}): Promise<PostInterface[] | null> => {
	if (typeof summary !== 'boolean') {
		throw new Error('Invalid summary');
	}

	const skip = (page - 1) * limit;

	const posts = await Post.find({}, { __v: 0 })
		.sort({ _id: -1 }) // 최신 게시글이 먼저 오도록 정렬
		.populate('author', 'username') // author 필드의 username만 가져오기
		.skip(skip) // 건너뛸 게시글 수
		.limit(limit) // 가져올 게시글 수
		.lean()
		.exec();

	if (!posts) {
		return null;
	}

	const result = posts.map((post) => transformUser(post));

	return result;
};

// 총 게시글 수를 가져오는 함수 추가
export const getTotalPostsCount = async (): Promise<number> => {
	return await Post.countDocuments({});
};

// 게시글 생성
export const createPostModel = async (
	title: string,
	contents: string,
	authorId: string
): Promise<PostInterface> => {
	const newPost = new Post({
		title,
		contents,
		author: new mongoose.Types.ObjectId(authorId),
	});

	// 입력 유효성 검사
	if (!title || typeof title !== 'string') {
		throw new Error('Invalid or missing title');
	}

	if (!contents || typeof contents !== 'string') {
		throw new Error('Invalid or missing contents');
	}

	const savedPost = await newPost.save();
	const populatedPost = await savedPost.populate('author', 'username');

	return transformUser(populatedPost.toObject());
};
