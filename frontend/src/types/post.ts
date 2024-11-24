export interface PostInterface {
	id: string;
	title: string;
	contents: string;
	author: string;
	createdAt: string;
}

export interface CreatePostResponse {
	success: boolean;
	post: PostInterface;
}

export interface ErrorResponse {
	success: boolean;
	message: string;
}
export interface Response<T> {
	success: boolean;
	data?: T;
	message?: string;
}

export interface DeletePostResposne extends ErrorResponse {}

export interface LikeErrorResponse extends ErrorResponse {}

export interface IComment {
	id: string;
	postId: string;
	author: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface IBaseResponse {
	data: string;
}
