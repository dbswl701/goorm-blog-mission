import { CreatePostResponse } from '@type/post';
import axios from 'axios';

export const postCreatePost = async (
	title: string,
	contents: string
): Promise<CreatePostResponse> => {
	let res;
	try {
		res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/posts`, {
			title,
			contents,
		});
		return res.data as CreatePostResponse;
	} catch (error) {
		console.error('Error fetching data: ', error);
		throw new Error('Failed to fetch posts');
	}
};
