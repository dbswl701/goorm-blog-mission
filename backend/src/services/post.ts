import { NotFoundError } from '../errors/NotFoundError';
import {
	getPostById,
	getAllPosts,
	createPostModel,
	updatePostModel,
	deletePostMoel,
	GetAllPosts,
} from '../models/post/post';

import { PostInterface } from '../types';

export const getPost = async (
	id: string,
	currentUserId: string
): Promise<PostInterface> => {
	const post = await getPostById(id, currentUserId);

	return post;
};

// 게시글 생성
export const createPost = async (
	title: string,
	contents: string,
	authorId: string
): Promise<PostInterface> => {
	const post = await createPostModel(title, contents, authorId);
	return post;
};

// 게시글 수정
export const updatePost = async (
	id: string,
	title: string,
	contents: string,
	authorId: string
): Promise<PostInterface> => {
	const updatedPost = await updatePostModel(id, title, contents, authorId);
	return updatedPost;
};

// 게시글 삭제
export const deletePost = async (
	id: string,
	authorId: string
): Promise<void> => {
	await deletePostMoel(id, authorId);
};

export interface GetPostsParams {
	page: number;
	limit: number;
	sort: string;
	search: string;
	searchBy: string;
}

// 게시글을 가져오는 함수 수정
export const getPosts = async ({
	page,
	limit,
	sort,
	search,
	searchBy,
}: GetPostsParams): Promise<{ posts: GetAllPosts[]; total: number }> => {
	const { posts, total } = await getAllPosts({
		page,
		limit,
		sort,
		search,
		searchBy,
	});

	if (!posts) {
		throw new Error('Not found posts');
	}

	return { posts, total };
};
