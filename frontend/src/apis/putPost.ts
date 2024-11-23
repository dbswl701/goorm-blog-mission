import axios from 'axios';
import { Post } from '@components/PostList/PostList';

export const putPost = async (
	id: string,
	title: string,
	contents: string
): Promise<Post> => {
	try {
		const res = await axios.put(
			`${import.meta.env.VITE_SERVER_URL}/posts/${id}`,
			{
				title,
				contents,
			}
		);
		return res.data as Post;
	} catch (error) {
		console.error('Error fetching data: ', error);
		throw new Error('Failed to fetch posts');
	}
};
