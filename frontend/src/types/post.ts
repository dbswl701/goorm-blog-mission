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
export interface SuccessResponse {
	success: boolean;
	data: any;
}

export interface DeletePostResposne extends ErrorResponse {}

export interface LikeErrorResponse extends ErrorResponse {}
