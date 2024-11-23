import express, { Response, Request, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import {
	createComment,
	deleteComment,
	getCommentsByPostId,
	updateComment,
} from '../services/comment';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError';
import { isValidString } from '../utils/validation';

const router = express.Router({ mergeParams: true }); // 부모 라우트의 params를 병합

// 댓글 생성
router.post(
	'/',
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		const { postId } = req.params;
		const userId = req.session.user!.id;
		const userName = req.session.user!.username;
		const { content } = req.body;

		try {
			// 유효성 검사
			if (!mongoose.Types.ObjectId.isValid(postId)) {
				throw new BadRequestError('유효하지 않은 게시글 ID입니다.');
			}
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				throw new BadRequestError('유효하지 않은 사용자 ID입니다.');
			}
			if (!isValidString(content)) {
				throw new BadRequestError(
					'댓글 내용은 빈 문자열일 수 없습니다.'
				);
			}

			const newComment = await createComment(
				postId,
				userId,
				userName,
				content
			);
			res.status(201).json({
				success: true,
				data: newComment,
			});
		} catch (error) {
			next(error);
		}
	}
);

// 댓글 목록 조회
router.get(
	'/',
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		const { postId } = req.params;

		try {
			// 유효성 검사
			if (!mongoose.Types.ObjectId.isValid(postId)) {
				throw new BadRequestError('유효하지 않은 게시글 ID입니다.');
			}

			const comments = await getCommentsByPostId(postId);
			res.status(200).json({
				success: true,
				data: comments,
			});
		} catch (error) {
			next(error);
		}
	}
);

// 댓글 수정
router.put(
	'/:commentId',
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		const { commentId } = req.params;
		const userId = req.session.user!.id;
		const userName = req.session.user!.username;
		const { content } = req.body;

		try {
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
				throw new BadRequestError(
					'댓글 내용은 빈 문자열일 수 없습니다.'
				);
			}

			const updatedComment = await updateComment(
				commentId,
				userId,
				userName,
				content
			);
			res.status(200).json({
				success: true,
				data: updatedComment,
			});
		} catch (error) {
			next(error);
		}
	}
);

// 댓글 삭제
router.delete(
	'/:commentId',
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		const { commentId } = req.params;
		const userId = req.session.user!.id;

		try {
			// 유효성 검사
			if (!mongoose.Types.ObjectId.isValid(commentId)) {
				throw new BadRequestError('유효하지 않은 게시글 ID입니다.');
			}
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				throw new BadRequestError('유효하지 않은 댓글 ID입니다.');
			}

			await deleteComment(commentId, userId);
			res.status(200).json({
				success: true,
				data: { message: '댓글이 성공적으로 삭제되었습니다.' },
			});
		} catch (error) {
			next(error);
		}
	}
);
export default router;
