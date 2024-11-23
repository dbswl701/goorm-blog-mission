import mongoose from 'mongoose';
import { CommentInterface } from '../../types/comment';
import { BadRequestError } from '../errors/BadRequestError';
import { isValidObjectId, isValidString } from '../utils/validation';
import postModel from '../models/post/schema';
import { NotFoundError } from '../errors/NotFoundError';
import commentModel from '../models/comment/schema';
import userModel from '../models/user/schema';

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

// 댓글 수정
export const updateComment = async (
	commentId: string,
	userId: string,
	userName: string,
	content: string
): Promise<CommentInterface> => {
	// 유효성 검사
	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		throw new BadRequestError('유효하지 않은 게시글 ID입니다.');
	}
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		throw new BadRequestError('유효하지 않은 댓글 ID입니다.');
	}
	if (!isValidString(userName)) {
		throw new BadRequestError('유효하지 않은 사용자 이름입니다.');
	}
	if (!isValidString(content)) {
		throw new BadRequestError('댓글 내용은 빈 문자열일 수 없습니다.');
	}

	// 댓글 조회
	const comment = await commentModel.findById(commentId).exec();
	if (!comment) {
		throw new NotFoundError('댓글이 존재하지 않습니다.');
	}

	// 댓글 작성자 확인
	if (comment.author.toString() !== userId) {
		throw new NotFoundError('수정 권한이 없습니다.'); // -> 권한이면 다른 에러코드 아닌가?
	}

	// 댓글 업데이트
	comment.content = content.trim();
	const updatedComment = await comment.save();

	return {
		id: updatedComment._id.toString(),
		postId: updatedComment.postId.toString(),
		author: userName,
		content: updatedComment.content,
		createdAt: updatedComment.createdAt,
		updatedAt: updatedComment.updatedAt,
	};
};

// 댓글 삭제
export const deleteComment = async (
	commentId: string,
	userId: string
): Promise<void> => {
	// 유효성 검사
	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		throw new BadRequestError('유효하지 않은 게시글 ID입니다.');
	}
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		throw new BadRequestError('유효하지 않은 댓글 ID입니다.');
	}

	// 댓글 조회
	const comment = await commentModel.findById(commentId).exec();
	if (!comment) {
		throw new NotFoundError('댓글이 존재하지 않습니다.');
	}

	// 댓글 작성자 확인
	console.log('[model] comment: ', comment);
	if (comment.author.toString() !== userId) {
		throw new NotFoundError('삭제 권한이 없습니다.'); // -> ? 다른 에러 아닌가?
	}

	// 댓글 삭제
	await commentModel.deleteOne({ _id: commentId }).exec();
};
