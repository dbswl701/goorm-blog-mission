import mongoose from 'mongoose';
import { CommentInterface } from '../../types/comment';
import { BadRequestError } from '../errors/BadRequestError';
import { isValidObjectId, isValidString } from '../utils/validation';
import postModel from '../models/post/schema';
import { NotFoundError } from '../errors/NotFoundError';
import commentModel from '../models/comment/schema';

// 댓글 생성
export const createComment = async (
	postId: string,
	userId: string,
	userName: string,
	content: string
): Promise<CommentInterface> => {
	if (!mongoose.Types.ObjectId.isValid(postId)) {
		throw new BadRequestError('유효하지 않은 게시글 ID입니다.');
	}
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		throw new BadRequestError('유효하지 않은 사용자 ID입니다.');
	}
	if (!isValidString(content)) {
		throw new BadRequestError('댓글 내용은 빈 문자열일 수 없습니다.');
	}

	// 게시글 존재 여부 확인
	const postExists = await postModel.exists({ _id: postId });
	if (!postExists) {
		throw new NotFoundError('해당 게시글이 존재하지 않습니다.');
	}

	// 댓글 생성
	const comment = new commentModel({
		postId: new mongoose.Types.ObjectId(postId),
		author: new mongoose.Types.ObjectId(userId),
		content: content.trim(),
	});
	const savedComment = await comment.save();

	return {
		id: savedComment._id.toString(),
		postId: postId,
		author: userName,
		content: savedComment.content,
		createdAt: savedComment.createdAt,
		updatedAt: savedComment.updatedAt,
	};
};

// 게시글에 대한 댓글 확인
export const getCommentsByPostId = async (
	postId: string
): Promise<CommentInterface[]> => {
	// 유효성 검사
	if (!mongoose.Types.ObjectId.isValid(postId)) {
		throw new BadRequestError('유효하지 않은 게시글 ID입니다.');
	}

	// 게시글 존재 여부 확인
	const postExists = await postModel.exists({ _id: postId });
	if (!postExists) {
		throw new NotFoundError('해당 게시글이 존재하지 않습니다.');
	}

	// 댓글 조회
	const comments = await commentModel
		.find({ postId })
		.populate('author', 'username')
		.sort({ createdAt: -1 })
		.exec();

	return comments.map((comment) => ({
		id: comment._id.toString(),
		postId: comment.postId.toString(),
		author: (comment.author as any).username,
		content: comment.content,
		createdAt: comment.createdAt,
		updatedAt: comment.updatedAt,
	}));
};
