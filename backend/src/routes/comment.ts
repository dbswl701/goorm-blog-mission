import express, { Response, Request, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import {
	createComment,
	deleteComment,
	getCommentsByPostId,
	updateComment,
} from '../services/comment';

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
