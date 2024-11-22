import express, { Response, Request, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { createComment, getCommentsByPostId } from '../services/comment';

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

export default router;
