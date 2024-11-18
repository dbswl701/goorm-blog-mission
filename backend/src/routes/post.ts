import express from 'express';
import { Request, Response } from 'express';
import { getPost, getPosts } from '../services/post';

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

router.get('/', async (req: Request, res: Response) => {
	try {
		const posts = await getPosts({ summary: true });

		res.status(200).json(posts);
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

export default router;
