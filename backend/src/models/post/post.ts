import mongoose from 'mongoose';
import Post from './schema';
import { PostInterface } from '../../types';
import { NotFoundError } from '../../errors/NotFoundError';
import postModel from './schema';
import { GetPostsParams } from '../../services/post';
import { buildSearchCondition } from '../../utils/search';
import { BadRequestError } from '../../errors/BadRequestError';
import { buildSortCondition } from '../../utils/sort';
import { PermissionError } from '../../errors/PermissionError';
import commentModel from '../comment/schema';
import likeModel from '../like/schema';

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
	const detailedPost = post[0];

	if (!detailedPost) {
		throw new NotFoundError('게시글이 존재하지 않습니다.');
	}
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

	const sortCondition = buildSortCondition(sort);

	// 검색 결과 총 개수 계산
	const total = await Post.countDocuments(searchCondition);

	// page 유효성 검사
	// if (Math.ceil(total / limit) < page) {
	// 	throw new BadRequestError(`유효하지 않은 page 번호 입니다.`);
	// }

	// // limit 유효성 검사
	// if (total < limit) {
	// 	throw new BadRequestError(`유효하지 않은 limit 입니다.`);
	// }

	// Aggregation Pipeline
	const rawPosts = await Post.aggregate([
		{ $match: searchCondition }, // 검색 조건 적용
		{
			$lookup: {
				from: 'users', // Like 모델 조인
				localField: 'author',
				foreignField: '_id',
				as: 'authorDetail',
			},
		},
		{
			$lookup: {
				from: 'likes', // Like 모델 조인
				localField: '_id',
				foreignField: 'postId',
				as: 'likes',
			},
		},
		{
			$lookup: {
				from: 'comments', // Comment 모델 조인
				localField: '_id',
				foreignField: 'postId',
				as: 'comments',
			},
		},
		{
			$addFields: {
				likeCount: { $size: '$likes' },
				commentCount: { $size: '$comments' },
			},
		},
		{ $sort: sortCondition }, // 정렬 조건 적용
		{ $skip: skip }, // 페이지네이션
		{ $limit: limit },
		{
			$project: {
				likes: 0,
				comments: 0,
			},
		},
	]);

	const posts = rawPosts.map((post) => ({
		id: post._id.toString(), // _id를 id로 변환
		title: post.title,
		contents: post.contents,
		author: post.authorDetail[0].username,
		likeCount: post.likeCount || 0,
		commentCount: post.commentCount || 0,
		createdAt: post.createdAt,
		updatedAt: post.updatedAt,
	}));

	return { posts, total };
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
	const session = await mongoose.startSession();
	if (!session) {
		throw new Error('트랜잭션 세션을 시작할 수 없습니다.');
	}

	session.startTransaction();

	try {
		// 게시글 찾기
		const post = await Post.findById(id).session(session).exec();
		if (!post) {
			throw new NotFoundError('게시글을 찾을 수 없습니다.');
		}

		// 작성자 확인
		if (post.author.toString() !== authorId) {
			throw new PermissionError('삭제 권한이 없습니다.');
		}

		// 게시글 삭제
		await Post.findByIdAndDelete(id).session(session).exec();

		// 연관된 댓글 삭제
		await commentModel.deleteMany({ postId: id }).session(session).exec();
		const comment = await commentModel.find({}).exec();

		// 연관된 좋아요 삭제
		await likeModel.deleteMany({ postId: id }).session(session).exec();
		const like = await likeModel.find({});

		// 트랜잭션 커밋
		await session.commitTransaction();
	} catch (error) {
		// 트랜잭션 롤백
		await session.abortTransaction();
		throw error;
	}
};

// 게시글 존재 여부 확인
export const isPostExists = async (postId: string) => {
	const postExists = await postModel.exists({ _id: postId });
	return !!postExists;
};
