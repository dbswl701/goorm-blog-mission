import mongoose from 'mongoose';
import { CommentInterface } from '../../types/comment';
import postModel from '../models/post/schema';
import { NotFoundError } from '../errors/NotFoundError';
import commentModel from '../models/comment/schema';
import { isPostExists } from '../models/post/post';
import {
	createCommentModel,
	deleteCommentModel,
	getCommentsByPostIdModel,
	updateCommentModel,
} from '../models/comment/comment';

// 댓글 생성
export const createComment = async (
	postId: string,
	userId: string,
	userName: string,
	content: string
): Promise<CommentInterface> => {
	// 게시글 존재 여부 확인
	const postExists = await isPostExists(postId);
	if (!postExists) {
		throw new NotFoundError('해당 게시글이 존재하지 않습니다.');
	}
	// 댓글 생성
	const savedComment = await createCommentModel(
		postId,
		userId,
		userName,
		content
	);

	return savedComment;
};

// 게시글에 대한 댓글 확인
export const getCommentsByPostId = async (
	postId: string
): Promise<CommentInterface[]> => {
	// 게시글 존재 여부 확인
	const postExists = await isPostExists(postId);
	if (!postExists) {
		throw new NotFoundError('해당 게시글이 존재하지 않습니다.');
	}

	// 댓글 조회
	const comments = await getCommentsByPostIdModel(postId);

	return comments;
};

// 댓글 수정
export const updateComment = async (
	commentId: string,
	userId: string,
	userName: string,
	content: string
): Promise<CommentInterface> => {
	const updatedComment = await updateCommentModel(
		commentId,
		userId,
		userName,
		content
	);
	return updatedComment;
};

// 댓글 삭제
export const deleteComment = async (
	commentId: string,
	userId: string
): Promise<void> => {
	await deleteCommentModel(commentId, userId);
};
