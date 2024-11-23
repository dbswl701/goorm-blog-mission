import mongoose from 'mongoose';
import Post from './schema';
import { PostInterface } from '../../types';
import { NotFoundError } from '../../errors/NotFoundError';
import postModel from './schema';
import { GetPostsParams } from '../../services/post';
import { buildSearchCondition } from '../../utils/search';
import likeModel from '../like/schema';
import commentModel from '../comment/schema';

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

export interface GetAllPosts extends PostInterface {
	likeCount: number;
	commentCount: number;
}

// 실제 게시글을 데이터베이스에서 가져오는 함수 수정
export const getAllPosts = async ({
	page,
	limit,
	sort,
	search,
	searchBy,
}: GetPostsParams): Promise<{ posts: GetAllPosts[]; total: number }> => {
	const skip = (page - 1) * limit;

	// 검색 조건 생성
	const searchCondition = buildSearchCondition(search, searchBy);

	// 정렬 조건 생성
	let sortCondition: any = {};
	switch (sort) {
		case 'likes':
			sortCondition = { likeCount: -1 };
			break;
		case 'comments':
			sortCondition = { commentCount: -1 };
			break;
		case 'latest':
		default:
			sortCondition = { createdAt: -1 };
			break;
	}

	// 검색 결과 총 개수 계산
	const total = await Post.countDocuments(searchCondition);

	// 페이지네이션된 게시글 조회
	const query = Post.find(searchCondition)
		.sort(sortCondition)
		.skip(skip)
		.limit(limit)
		.populate('author', 'username') // 작성자의 username만 가져오기
		.lean(); // Mongoose Document 대신 일반 JS 객체 반환
	const posts = await query.exec();

	// 좋아요 개수 및 댓글 개수 추가
	const result: GetAllPosts[] = [];
	for (const post of posts) {
		const likeCount = await likeModel.countDocuments({ postId: post._id });
		const commentCount = await commentModel.countDocuments({
			postId: post._id,
		});

		result.push({
			id: post._id.toString(),
			title: post.title,
			contents: post.contents,
			author: (post.author as any).username,
			likeCount,
			commentCount,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
		});
	}

	return { posts: result, total };
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

// 게시글 존재 여부 확인
export const isPostExists = async (postId: string) => {
	const postExists = await postModel.exists({ _id: postId });
	return !!postExists;
};
