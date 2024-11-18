import crypto from 'crypto';

import User from './schema';
import { UserInterface } from '../../types';

export const createUser = async (
	username: string,
	password: string
): Promise<UserInterface> => {
	if (!username || typeof username !== 'string') {
		throw new Error('Invalid username');
	}

	if (!password || typeof password !== 'string') {
		throw new Error('Invalid password');
	}

	const hashedPassword = crypto
		.createHash('sha512')
		.update(password)
		.digest('base64');

	const user = new User({ username, password: hashedPassword });
	const savedUser = await user.save();

	return { id: savedUser._id.toString(), username: savedUser.username };
};

export const isExistUser = async (username: string): Promise<boolean> => {
	if (!username || typeof username !== 'string') {
		throw new Error('Invalid username');
	}

	const result = await User.exists({ username });

	return !!result;
};

export const getUser = async (
	username: string,
	password: string
): Promise<UserInterface | null> => {
	if (!username || typeof username !== 'string') {
		throw new Error('Invalid userId');
	}

	if (!password || typeof password !== 'string') {
		throw new Error('Invalid password');
	}

	const hashedPassword = crypto
		.createHash('sha512')
		.update(password)
		.digest('base64');

	const result = await User.findOne(
		{ username, password: hashedPassword },
		{ __v: 0, password: 0 }
	).lean();

	if (!result) {
		return null;
	}

	return { id: result._id.toString(), username: result.username };
};
