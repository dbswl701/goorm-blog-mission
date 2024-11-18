import { Post } from "@components/PostList/PostList";
import axios from "axios";
export interface PostsResponse {
	posts: Post[];
	total: number;
	page: number;
	limit: number;
  }
export const getPostList = async ({pageParam}: {pageParam: number | unknown}): Promise<PostsResponse> => {
    let res;
    try {
        res = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/posts?page=${pageParam}&limit=10`
        );
        return res.data as PostsResponse;
    } catch (error) {
        console.error('Error fetching data: ', error);
        throw new Error('Failed to fetch posts');
    }

}