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
