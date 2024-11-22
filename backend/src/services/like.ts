import { isValidObjectId } from 'mongoose';
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

		// 좋아요 중복 방지(인덱스 설정으로 자동 방지 가능하지만, 명시적으로 처리)
		const existingLike = await likeModel.findOne({ postId, userId }).exec();
		const likes = await likeModel.find({});
		console.log('likes: ', likes);
		if (existingLike) {
			throw new AlreadyLikedError('이미 좋아요를 누른 게시글입니다.');
		}

		// 좋아요 추가
		const like = new likeModel({ postId, userId });
		await like.save();
	} catch (error) {
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

		// 좋아요 여부 확인
		const existingLike = await likeModel.findOne({ postId, userId }).exec();
		const likes = await likeModel.find({});
		console.log('likes: ', likes);
		if (!existingLike) {
			throw new NotLikedError('이미 좋아요 취소된 게시물입니다.');
		}

		// 좋아요 제거
		await likeModel.deleteOne({ postId, userId }).exec();
	} catch (error) {
		throw error;
	}
};
