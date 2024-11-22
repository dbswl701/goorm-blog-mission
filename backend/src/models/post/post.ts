import mongoose from 'mongoose';
import Post from './schema';
import { PostInterface } from '../../types';
import { NotFoundError } from '../../errors/NotFoundError';

export const transformUserWithPopulate = (post: any): PostDetailed => {
	const { _id, author, ...rest } = post;

	return {
		...rest,
		id: _id.toString(),
		author: author.username,
	};
};

export interface PostDetailed extends PostInterface {
	isLikedByUser: boolean;
}

export const getPostById = async (
	id: string,
	currentUserId: string
): Promise<PostDetailed> => {
	try {
		const post = await Post.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(id) } },
			{
				$lookup: {
					from: 'likes',
					localField: '_id',
					foreignField: 'postId',
					as: 'likes',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'author',
					foreignField: '_id',
					as: 'authorDetails',
				},
			},
			{
				$addFields: {
					likeCount: { $size: '$likes' },
					isLikedByUser: {
						$in: [
							new mongoose.Types.ObjectId(currentUserId),
							'$likes.userId',
						],
					},
					authorUsername: {
						$arrayElemAt: ['$authorDetails.username', 0],
					},
				},
			},
			{
				$project: {
					likes: 0,
					authorDetails: 0,
				},
			},
		]);

		if (!post || post.length === 0) {
			throw new NotFoundError('게시글이 존재하지 않습니다.');
		}
		// const result: PostDetailed = transformUserById(post[0]);
		const detailedPost = post[0];
		return {
			id: detailedPost._id.toString(),
			title: detailedPost.title,
			contents: detailedPost.contents,
			author: detailedPost.authorUsername,
			likeCount: detailedPost.likeCount,
			isLikedByUser: detailedPost.isLikedByUser,
			createdAt: detailedPost.createdAt,
			updatedAt: detailedPost.updatedAt,
		};
	} catch (error: any) {
		throw new Error(error.message || '게시글 불러오기에 실패했습니다.');
	}
};

// 실제 게시글을 데이터베이스에서 가져오는 함수 수정
export const getAllPosts = async ({
	page = 1,
	limit = 10,
}: {
	page: number;
	limit: number;
}): Promise<PostInterface[] | null> => {
	const skip = (page - 1) * limit;

	// const posts = await Post.find({}, { __v: 0 })
	// 	.sort({ _id: -1 }) // 최신 게시글이 먼저 오도록 정렬
	// 	.populate('author', 'username') // author 필드의 username만 가져오기
	// 	.skip(skip) // 건너뛸 게시글 수
	// 	.limit(limit) // 가져올 게시글 수
	// 	.lean()
	// 	.exec();

	const posts = await Post.aggregate([
		{ $sort: { _id: -1 } },
		{ $skip: skip },
		{ $limit: limit },
		{
			$lookup: {
				from: 'likes',
				localField: '_id',
				foreignField: 'postId',
				as: 'likes',
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'author',
				foreignField: '_id',
				as: 'authorDetails',
			},
		},
		{
			$addFields: {
				likeCount: { $size: '$likes' },
				authorUsername: {
					$arrayElemAt: ['$authorDetails.username', 0],
				},
			},
		},
		{
			$project: {
				likes: 0, // 원본 likes 배열 제외
				authorDetails: 0,
			},
		},
	]);

	return posts.map((post: any) => ({
		id: post._id.toString(),
		title: post.title,
		contents: post.contents,
		author: post.authorUsername,
		likeCount: post.likeCount,
		createdAt: post.createdAt,
		updatedAt: post.updatedAt,
	}));
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

	const savedPost = await newPost.save();
	const populatedPost = await savedPost.populate('author', 'username');

	return transformUserWithPopulate(populatedPost.toObject());
};

// 게시글 수정
export const updatePostModel = async (
	id: string,
	title: string,
	contents: string,
	authorId: string
): Promise<PostInterface> => {
	// 게시글 찾기
	const post = await Post.findById(id).exec();
	if (!post) {
		throw new Error('게시글을 찾을 수 없습니다.');
	}

	// 작성자 확인
	if (post.author.toString() !== authorId) {
		throw new Error('수정 권한이 없습니다.');
	}

	// 필드 업데이트
	post.title = title;
	post.contents = contents;

	// 필드 수정
	const savedPost = await post.save();
	const populatedPost = await savedPost.populate('author', 'username');

	return transformUserWithPopulate(populatedPost.toObject());
};

// 게시글 삭제
export const deletePostMoel = async (
	id: string,
	authorId: string
): Promise<void> => {
	// 게시글 찾기
	const post = await Post.findById(id).exec();
	if (!post) {
		throw new Error('게시글을 찾을 수 없습니다.');
	}

	// 작성자 확인
	if (post.author.toString() !== authorId) {
		throw new Error('삭제 권한이 없습니다.');
	}

	// 게시글 삭제
	await Post.findByIdAndDelete(id).exec();
};
