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
	sort,
	filter,
}: {
	pageParam: number | unknown;
	search: string;
	sort: string;
	filter: string;
}): Promise<PostsResponse> => {
	let res;
	try {
		const params: any = {
			page: pageParam,
			limit: 10,
		};
		if (search) params.search = search;
		if (sort) params.sort = sort;
		if (filter) params.searchBy = filter;

		res = await axios.get('/posts', {
			params,
		});
		return res.data as PostsResponse;
	} catch (error) {
		console.error('Error fetching data: ', error);
		throw new Error('Failed to fetch posts');
	}
};
