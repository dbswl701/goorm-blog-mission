import { Post } from '@components/PostList/PostList';
import axios from 'axios';
export interface PostsResponse {
	posts: Post[];
	total: number;
	page: number;
	limit: number;
	totalPage: number;
}
export const getPostList = async ({
	pageParam,
	search,
}: {
	pageParam: number | unknown;
	search: string;
}): Promise<PostsResponse> => {
	let res;
	try {
		const params: any = {
			page: pageParam,
			limit: 10,
		};
		if (search) params.search = search;

		res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/posts`, {
			params,
		});
		return res.data as PostsResponse;
	} catch (error) {
		console.error('Error fetching data: ', error);
		throw new Error('Failed to fetch posts');
	}
};
