import {
	getPostById,
	getAllPosts,
	getTotalPostsCount,
	createPostModel,
} from '../models/post/post';

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
		throw new Error(error.message || 'Failed to create post');
	}
};

// export const getPosts = async ({
// 	summary = false,
// }: {
// 	summary: boolean;
// }): Promise<PostInterface[]> => {
// 	try {
// 		if (typeof summary !== 'boolean') {
// 			throw new Error('summary is invalid');
// 		}

// 		const post = await getAllPosts({ summary });

// 		if (!post) {
// 			throw new Error('Not found posts');
// 		}

// 		return post;
// 	} catch (error: any) {
// 		throw new Error(error.message || 'Failed to fetch post');
// 	}
// };
// 페이지네이션 응답 인터페이스 정의
interface PostsResponse {
	posts: PostInterface[];
	total: number;
	page: number;
	limit: number;
}

// 게시글을 가져오는 함수 수정
export const getPosts = async ({
	summary = false,
	page = 1,
	limit = 10,
}: {
	summary: boolean;
	page: number;
	limit: number;
}): Promise<PostInterface[]> => {
	try {
		if (typeof summary !== 'boolean') {
			throw new Error('summary is invalid');
		}

		const posts = await getAllPosts({ summary, page, limit });

		if (!posts) {
			throw new Error('Not found posts');
		}

		return posts;
	} catch (error: any) {
		throw new Error(error.message || 'Failed to fetch post');
	}
};

//   // 실제 게시글을 데이터베이스에서 가져오는 함수 수정
//   export const getAllPosts = async ({
// 	summary = false,
// 	page = 1,
// 	limit = 10,
//   }: {
// 	summary: boolean;
// 	page: number;
// 	limit: number;
//   }): Promise<PostInterface[] | null> => {
// 	if (typeof summary !== 'boolean') {
// 	  throw new Error('Invalid summary');
// 	}

// 	const skip = (page - 1) * limit;

// 	const posts = await Post.find({}, { __v: 0 })
// 	  .sort({ _id: -1 }) // 최신 게시글이 먼저 오도록 정렬
// 	  .populate('author', 'username') // author 필드의 username만 가져오기
// 	  .skip(skip) // 건너뛸 게시글 수
// 	  .limit(limit) // 가져올 게시글 수
// 	  .lean()
// 	  .exec();

// 	if (!posts) {
// 	  return null;
// 	}

// 	const result = posts.map((post) => transformUser(post));

// 	return result;
//   };

//   // 총 게시글 수를 가져오는 함수 추가
//   export const getTotalPostsCount = async (): Promise<number> => {
// 	return await Post.countDocuments({});
//   };
