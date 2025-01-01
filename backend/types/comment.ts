// src/types/comment.ts

export interface CommentInterface {
	id: string;
	postId: string;
	author: string; // username
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CommentDetailed extends CommentInterface {
	authorUsername: string;
}
