import mongoose from 'mongoose';
import Post from './schema';
import { PostInterface } from '../../types';

const transformUser = (post: any): PostInterface => {
	const { _id, author, ...rest } = post;

	return {
		...rest,
		id: _id.toString(),
		author: author.username,
	};
};

export const getPostById = async (
	id: string
): Promise<PostInterface | null> => {
	if (!id || typeof id !== 'string') {
		throw new Error('Invalid id');
	}

	const result = await Post.findOne(
		{ _id: new mongoose.Types.ObjectId(id) },
		{ __v: 0 }
	)
		.populate('author', 'username')
		.lean()
		.exec();

	if (!result) {
		return null;
	}

	return transformUser(result);
};

export const getAllPosts = async ({
	summary = false,
}: {
	summary: boolean;
}): Promise<PostInterface[] | null> => {
	if (typeof summary !== 'boolean') {
		throw new Error('Invalid summary');
	}

	const posts = await Post.find({}, { __v: 0 })
    	.sort({ _id: -1 })
		.populate('author', 'username')
		.lean()
		.exec();

	if (!posts) {
		return null;
	}

	const result = posts.map((post) => transformUser(post));

	return result;
};
