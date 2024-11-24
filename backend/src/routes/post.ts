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
import mongoose, { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError';
import { isValidString } from '../utils/validation';
import { likePost, unLikePost } from '../services/like';
import commentRouter from './comment'; // 댓글 라우터 임포트

const router = express.Router();

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	req.defaultErrorMessage = '게시글 불러오기에 실패했습니다.';

	try {
		const userId = req.session.user!.id;

		const post = await getPost(id, userId);

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

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	req.defaultErrorMessage = '게시글 목록 불러오기에 실패했습니다.';

	try {
		// 쿼리 파라미터에서 page와 limit을 가져오고 기본값 설정
		const {
			page = '1',
			limit = '10',
			sort = 'latest',
			search = '',
			searchBy = 'all',
		} = req.query;

		const pageNum = Number(page);
		const limitNum = Number(limit);
		const sortStr = String(sort);
		const searchStr = String(search);
		const searchByStr = String(searchBy);

		// 유효성 검사
		if (!Number.isInteger(pageNum) || pageNum < 1) {
			throw new BadRequestError('유효하지 않은 page 번호 입니다.');
		}

		if (!Number.isInteger(limitNum) || limitNum < 1) {
			throw new BadRequestError('유효하지 않은 limit 입니다.');
		}

		// 정렬 옵션 유효성 검사
		const validSortOptions = [
			'likes',
			'unlikes',
			'comments',
			'latest',
			'oldest',
		];
		if (!validSortOptions.includes(sort as string)) {
			throw new BadRequestError('유효하지 않은 정렬 옵션입니다.');
		}

		// 검색 옵션 유효성 검사
		const validSearchOptions = ['author', 'title', 'contents', 'all'];
		if (!validSearchOptions.includes(searchBy as string)) {
			throw new BadRequestError('유효하지 않은 검색 필터 옵션입니다.');
		}

		// 게시글 가져오기
		const { posts, total } = await getPosts({
			page: pageNum,
			limit: limitNum,
			sort: sortStr,
			search: searchStr,
			searchBy: searchByStr,
		});

		res.status(200).json({
			posts,
			total,
			page: pageNum,
			totalPage: Math.ceil(total / limitNum),
		});
	} catch (error: any) {
		next(error);
	}
});

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
);
// 좋아요 추가
router.post(
	'/:id/like',
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const userId = req.session.user!.id;
		req.defaultErrorMessage = '좋아요에 실패했습니다.';

		try {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new BadRequestError('유효하지 않은 게시글 ID 입니다.');
			}
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				throw new BadRequestError('유효하지 않은 사용자 ID 입니다.');
			}

			await likePost(id, userId);
			res.status(200).json({
				success: true,
				data: {
					message: '게시글에 좋아요를 추가했습니다.',
				},
			});
		} catch (error) {
			next(error);
		}
	}
);
// 좋아요 취소
router.post(
	'/:id/unlike',
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const userId = req.session.user!.id;
		req.defaultErrorMessage = '좋아요 취소에 실패했습니다.';

		try {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new BadRequestError('유효하지 않은 게시글 ID 입니다.');
			}
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				throw new BadRequestError('유효하지 않은 사용자 ID 입니다.');
			}
			await unLikePost(id, userId);
			res.status(200).json({
				success: true,
				data: {
					message: '게시글의 좋아요를 취소했습니다.',
				},
			});
		} catch (error) {
			next(error);
		}
	}
);

// 댓글 라우터 연결
router.use('/:postId/comments', commentRouter);

export default router;
