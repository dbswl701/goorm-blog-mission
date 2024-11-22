import express from 'express';
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

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const post = await getPost(id);

		res.status(200).json(post);
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

// 게시글 생성
router.post('/', authenticate, async (req: Request, res: Response) => {
	const { title, contents } = req.body;
	console.log('세션:', req.session);

	try {
		// 입력 유효성 검사
		if (!title || typeof title !== 'string') {
			throw new Error('Invalid or missing title');
		}

		if (!contents || typeof contents !== 'string') {
			throw new Error('Invalid or missing contents');
		}
		const authorId = req.session.user!.id;
		const newPost = await createPost(title, contents, authorId);

		res.status(201).json({ result: true, data: newPost });
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

// 게시글 수정
router.put(`/:id`, authenticate, async (req: Request, res: Response) => {
	// 세션의 userId와 디비에 저장되어 있는 게시글의 authorId 비교 필요
	const { id } = req.params;
	const { title, contents } = req.body;
	try {
		const authorId = req.session.user!.id;
		// 입력 유효성 검사
		if (!title || typeof title !== 'string') {
			throw new Error('제목은 빈 문자열일 수 없습니다.');
		}

		if (!contents || typeof contents !== 'string') {
			throw new Error('내용은 빈 문자열일 수 없습니다.');
		}

		if (!id || typeof id !== 'string') {
			throw new Error('유효하지 않은 게시글 ID입니다.');
		}

		if (!authorId || typeof authorId !== 'string') {
			throw new Error('유효하지 않은 작성자 ID입니다.');
		}
		const updatedPost = await updatePost(id, title, contents, authorId);
		// res.status(200).json({ result: true, data: '로그인 성공' });

		res.status(200).json({ result: true, data: updatedPost });
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
		// Error 메시지에 따라서 status 코드 다르게 보내기. 에러 핸들링
		// 그냥 status 코드를 보내고 그에 따라서 객체로 만들어서 보내는게 좋지 않을까?
	}
});

// router.get('/', async (req: Request, res: Response) => {
// 	try {
// 		const posts = await getPosts({ summary: true });

// 		res.status(200).json(posts);
// 	} catch (error: any) {
// 		res.status(500).json({ result: false, message: error.message });
// 	}
// });

router.get(
	'/',
	async (req: Request, res: Response) => {
		try {
			// 쿼리 파라미터에서 page와 limit을 가져오고 기본값 설정
			const { page = '1', limit = '10' } = req.query;
			const pageNum = parseInt(page as string, 10);
			const limitNum = parseInt(limit as string, 10);

			// 유효성 검사
			if (isNaN(pageNum) || pageNum < 1) {
				return res
					.status(400)
					.json({ result: false, message: 'Invalid page number' });
			}

			if (isNaN(limitNum) || limitNum < 1) {
				return res
					.status(400)
					.json({ result: false, message: 'Invalid limit number' });
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
			res.status(500).json({ result: false, message: error.message });
		}
	},

	// 게시글 삭제
	router.delete('/:id', authenticate, async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const authorId = req.session.user!.id;
			await deletePost(id, authorId);

			res.status(200).json({
				result: true,
				message: '게시글이 성공적으로 삭제되었습니다.',
			});
		} catch (error: any) {
			res.status(500).json({
				result: false,
				message: error.message || '게시글 삭제에 실패했습니다.',
			});
		}
	})
);

export default router;
