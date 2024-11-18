import { getPostById, getAllPosts } from '../models/post/post';

import { PostInterface } from '../types';

export const getPost = async (id: string): Promise<PostInterface> => {
	try {
		const post = await getPostById(id);

		if (!post) {
			throw new Error('Not found post');
		}

		return post;
	} catch (error: any) {
		throw new Error(error.message || 'Failed to fetch post');
	}
};

export const getPosts = async ({
	summary = false,
}: {
	summary: boolean;
}): Promise<PostInterface[]> => {
	try {
		if (typeof summary !== 'boolean') {
			throw new Error('summary is invalid');
		}

		const post = await getAllPosts({ summary });

		if (!post) {
			throw new Error('Not found posts');
		}

		return post;
	} catch (error: any) {
		throw new Error(error.message || 'Failed to fetch post');
	}
};
