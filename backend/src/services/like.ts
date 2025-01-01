import mongoose, { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError';
import postModel from '../models/post/schema';
import { NotFoundError } from '../errors/NotFoundError';
import likeModel from '../models/like/schema';
import { AlreadyLikedError } from '../errors/AlreadyLikedError';
import { NotLikedError } from '../errors/NotLikedError';

export const likePost = async (
	postId: string,
	userId: string
): Promise<void> => {
	try {
		// 게시글 존재 여부 확인
		const postExists = await postModel.exists({ _id: postId });
		if (!postExists) {
			throw new NotFoundError('해당 게시글이 존재하지 않습니다.');
		}

		// 좋아요 추가
		const like = new likeModel({
			postId,
			userId,
		});

		await like.save();
	} catch (error: any) {
		// unique index 에러 처리
		if (error.code === 11000) {
			throw new AlreadyLikedError('이미 좋아요를 누른 게시글입니다.');
		}
		throw error;
	}
};

export const unLikePost = async (
	postId: string,
	userId: string
): Promise<void> => {
	try {
		// 게시글 존재 여부 확인
		const postExists = await postModel.exists({ _id: postId });
		if (!postExists) {
			throw new NotFoundError('해당 게시글이 존재하지 않습니다.');
		}

		// 좋아요 제거
		const result = await likeModel.deleteOne({ postId, userId }).exec();

		// 삭제된 문서가 없으면 이미 좋아요가 취소된 상태
		if (result.deletedCount === 0) {
			throw new NotLikedError('이미 좋아요 취소된 게시물입니다.');
		}
	} catch (error) {
		throw error;
	}
};
