import axios from 'axios';
import { Post } from '@components/PostList/PostList';

export const getPost = async (id: string): Promise<Post> => {
	try {
		const res = await axios.get(`/posts/${id}`);
		return res.data as Post;
	} catch (error) {
		console.error('Error fetching data: ', error);
		throw new Error('Failed to fetch posts');
	}
};
