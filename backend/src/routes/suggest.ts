import express, { Request, Response, NextFunction } from 'express';

import { getAutocompleteSuggestions } from '../services/searchQuery';
import { BadRequestError } from '../errors/BadRequestError';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const partial = req.query.q as string;

		if (!partial) {
			throw new BadRequestError('검색어를 입력해주세요.');
		}

		const suggestions = await getAutocompleteSuggestions(partial);
		console.log('req:', req, 'partial: ', partial);
		res.status(200).json({ suggestions });
	} catch (error) {
		next(error);
	}
});

export default router;
