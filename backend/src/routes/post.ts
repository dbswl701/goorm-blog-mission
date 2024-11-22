import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import {
	createPost,
	deletePost,
	getPost,
	getPosts,
	updatePost,
} from '../services/post';
import { getTotalPostsCount } from '../models/post/post';
import { authenticate } from '../middleware/auth';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError';
import { isValidString } from '../utils/validation';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	req.defaultErrorMessage = '게시글 불러오기에 실패했습니다.';

	try {
		const post = await getPost(id);

		res.status(200).json(post);
	} catch (error: any) {
		next(error);
	}
});

// 게시글 생성
router.post(
	'/',
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		req.defaultErrorMessage = '게시글 생성에 실패했습니다.';

		try {
			const { title, contents } = req.body;

			// 입력 유효성 검사
			if (!isValidString(title)) {
				throw new BadRequestError('제목은 빈 문자열일 수 없습니다.');
			}

			if (!isValidString(contents)) {
				throw new BadRequestError('내용은 빈 문자열일 수 없습니다.');
			}
			const authorId = req.session.user!.id;
			const newPost = await createPost(title, contents, authorId);

			res.status(201).json({ result: true, data: newPost });
		} catch (error: any) {
			next(error);
		}
	}
);

// 게시글 수정
router.put(
	`/:id`,
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		// 세션의 userId와 디비에 저장되어 있는 게시글의 authorId 비교 필요
		const { id } = req.params;
		const { title, contents } = req.body;
		req.defaultErrorMessage = '게시글 수정에 실패했습니다.';

		try {
			const authorId = req.session.user!.id;
			// 입력 유효성 검사
			if (!isValidString(title)) {
				throw new BadRequestError('제목은 빈 문자열일 수 없습니다.');
			}

			if (!isValidString(contents)) {
				throw new BadRequestError('내용은 빈 문자열일 수 없습니다.');
			}

			if (!isValidString(id)) {
				throw new BadRequestError('유효하지 않은 게시글 ID입니다.');
			}

			if (!isValidString(authorId)) {
				throw new BadRequestError('유효하지 않은 작성자 ID입니다.');
			}
			const updatedPost = await updatePost(id, title, contents, authorId);

			res.status(200).json({ result: true, data: updatedPost });
		} catch (error: any) {
			next(error);
		}
	}
);

router.get(
	'/',
	async (req: Request, res: Response, next: NextFunction) => {
		req.defaultErrorMessage = '게시글 목록 불러오기에 실패했습니다.';

		try {
			// 쿼리 파라미터에서 page와 limit을 가져오고 기본값 설정
			const { page = '1', limit = '10' } = req.query;

			const pageNum = Number(page);
			const limitNum = Number(limit);

			// 유효성 검사
			if (!Number.isInteger(pageNum) || pageNum < 1) {
				throw new BadRequestError('유효하지 않은 page 번호 입니다.');
			}

			if (!Number.isInteger(limitNum) || limitNum < 1) {
				throw new BadRequestError('유효하지 않은 limit 입니다.');
			}

			// 게시글 가져오기
			const posts = await getPosts({
				summary: true,
				page: pageNum,
				limit: limitNum,
			});
			const total = await getTotalPostsCount();

			res.status(200).json({
				posts,
				total,
				page: pageNum,
				limit: limitNum,
			});
		} catch (error: any) {
			next(error);
		}
	},

	// 게시글 삭제
	router.delete(
		'/:id',
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			req.defaultErrorMessage = '게시글 삭제에 실패했습니다.';
			try {
				const authorId = req.session.user!.id;

				// 입력 유효성 검사
				if (!isValidObjectId(id)) {
					throw new Error('유효하지 않은 게시글 ID입니다.');
				}

				if (!isValidObjectId(authorId)) {
					throw new Error('유효하지 않은 작성자 ID입니다.');
				}

				await deletePost(id, authorId);

				res.status(200).json({
					result: true,
					message: '게시글이 성공적으로 삭제되었습니다.',
				});
			} catch (error: any) {
				next(error);
			}
		}
	)
);

export default router;
