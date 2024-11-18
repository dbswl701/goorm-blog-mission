import express from 'express';
import { Request, Response } from 'express';
import { getPost, getPosts } from '../services/post';
import { getTotalPostsCount } from '../models/post/post';

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

// router.get('/', async (req: Request, res: Response) => {
// 	try {
// 		const posts = await getPosts({ summary: true });

// 		res.status(200).json(posts);
// 	} catch (error: any) {
// 		res.status(500).json({ result: false, message: error.message });
// 	}
// });

router.get('/', async (req: Request, res: Response) => {
	try {
	  // 쿼리 파라미터에서 page와 limit을 가져오고 기본값 설정
	  const { page = '1', limit = '10' } = req.query;
	  const pageNum = parseInt(page as string, 10);
	  const limitNum = parseInt(limit as string, 10);
  
	  // 유효성 검사
	  if (isNaN(pageNum) || pageNum < 1) {
		return res.status(400).json({ result: false, message: 'Invalid page number' });
	  }
  
	  if (isNaN(limitNum) || limitNum < 1) {
		return res.status(400).json({ result: false, message: 'Invalid limit number' });
	  }
  
	  // 게시글 가져오기
	  const posts = await getPosts({ summary: true, page: pageNum, limit: limitNum });
	  const total = await getTotalPostsCount();
  
	  res.status(200).json({ posts, total, page: pageNum, limit: limitNum });
	} catch (error: any) {
	  res.status(500).json({ result: false, message: error.message });
	}
  });
  
export default router;
