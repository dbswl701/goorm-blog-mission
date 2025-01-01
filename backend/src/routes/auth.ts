import express from 'express';
import { Request, Response } from 'express';
import { signup, login } from '../services/user';
import { AuthInterface, UserInterface } from '../types';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
	const { username, password } = req.body as AuthInterface;

	try {
		const user = await signup(username, password);

		res.status(200).json(user);
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

router.post('/login', async (req: Request, res: Response) => {
	const { username, password } = req.body;

	try {
		const user = await login(username, password);

		req.session.logined = true;
		req.session.user = user;

		res.status(200).json({ result: true, user });
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

router.get('/logout', async (req: Request, res: Response) => {
	if (req.session.user) {
		req.session.destroy((err) => {
			if (err) {
				return res
					.status(500)
					.json({ result: false, message: err.message });
			}

			res.status(200).json({ result: true });
		});
	} else {
		res.status(400).json({
			result: false,
			message: 'You are not logged in',
		});
	}
});

router.get('/id', (req: Request, res: Response) => {
	res.json({ username: req.session?.user?.username || null });
});

export default router;
