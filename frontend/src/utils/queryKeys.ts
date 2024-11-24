export const queryKeys = {
	posts: (search = '', sort = '', filter = 'all') =>
		['posts', search, sort, filter] as const,
	post: (id: string) => ['post', id] as const,
	comments: (postId: string) => ['comment', postId] as const,
	autoComplete: (keyword: string) => ['keyword', keyword] as const,
};
