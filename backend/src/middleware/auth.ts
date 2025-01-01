// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.session && req.session.logined && req.session.user) {
		return next();
	} else {
		return res.status(401).json({
			result: false,
			message: '로그인이 필요한 서비스입니다.',
		});
	}
};
