import { BadRequestError } from '../errors/BadRequestError';
import {
	getPostById,
	getAllPosts,
	getTotalPostsCount,
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
	try {
		const post = await getPostById(id, currentUserId);

		if (!post) {
			throw new Error('Not found post');
		}

		return post;
	} catch (error: any) {
		throw new Error(error.message || '개시글 불러오기에 실패했습니다.');
	}
};

// 게시글 생성
export const createPost = async (
	title: string,
	contents: string,
	authorId: string
): Promise<PostInterface> => {
	try {
		const post = await createPostModel(title, contents, authorId);
		return post;
	} catch (error: any) {
		throw new Error(error.message || '게시글 생성에 실패했습니다.');
	}
};

// 게시글 수정
export const updatePost = async (
	id: string,
	title: string,
	contents: string,
	authorId: string
): Promise<PostInterface> => {
	try {
		const updatedPost = await updatePostModel(
			id,
			title,
			contents,
			authorId
		);
		return updatedPost;
	} catch (error: any) {
		throw new Error(error.message || '게시글 수정에 실패했습니다.');
	}
};

// 게시글 삭제
export const deletePost = async (
	id: string,
	authorId: string
): Promise<void> => {
	// 유효한 ID인지 확인
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
