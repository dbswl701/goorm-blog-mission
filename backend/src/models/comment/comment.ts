import mongoose from 'mongoose';
import commentModel, { CommentSchemaInterface } from './schema';
import { getCommentsByPostId } from '../../services/comment';
import { comment } from '@uiw/react-md-editor';
import { NotFoundError } from '../../errors/NotFoundError';
import { CommentInterface } from '../../../types/comment';
import { PermissionError } from '../../errors/PermissionError';

// 댓글 생성
export const createCommentModel = async (
	postId: string,
	userId: string,
	userName: string,
	content: string
): Promise<CommentInterface> => {
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

// 특정 게시글에 대한 댓글 조회
export const getCommentsByPostIdModel = async (postId: string) => {
	const comments = await commentModel
		.find({ postId })
		.populate('author', 'username')
		.sort({ createdAt: -1 })
		.exec();

	return comments.map((comment) => ({
		id: comment._id.toString(),
		postId: comment.postId.toString(),
		author: (comment.author as any).username, // ?
		content: comment.content,
		createdAt: comment.createdAt,
		updatedAt: comment.updatedAt,
	}));
};

// 특정 댓글 업데이트
export const updateCommentModel = async (
	commentId: string,
	userId: string,
	userName: string,
	content: string
) => {
	// 댓글 조회
	const comment = await commentModel.findById(commentId).exec();
	if (!comment) {
		throw new NotFoundError('댓글이 존재하지 않습니다.');
	}

	// 댓글 작성자 확인
	if (comment.author.toString() !== userId) {
		throw new PermissionError('수정 권한이 없습니다.'); // -> 권한이면 다른 에러코드 아닌가?
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
export const deleteCommentModel = async (
	commentId: string,
	userId: string
): Promise<void> => {
	// 댓글 조회
	const comment = await commentModel.findById(commentId).exec();
	if (!comment) {
		throw new NotFoundError('댓글이 존재하지 않습니다.');
	}

	// 댓글 작성자 확인
	if (comment.author.toString() !== userId) {
		throw new PermissionError('삭제 권한이 없습니다.'); // -> ? 다른 에러 아닌가?
	}

	// 댓글 삭제
	await commentModel.deleteOne({ _id: commentId }).exec();
};
