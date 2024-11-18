import React from 'react';
import PostItem from '@components/PostListItem';
import { useGetPostList } from '@hooks/useGetPostList';
import ScrollToTopButton from '@components/ScrollToTopButton';

export interface Post {
	id: string;
	title: string;
	content: string;
	// 필요한 다른 필드들
	createdAt: string;
	contents: string;
	author: string;
}

const PostList = () => {
	const {
		data: posts,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetPostList();

	if (isLoading) return <div>로딩중</div>;
	if (error) return <div>에러</div>;
	console.log('posts: ', posts);
	return (
		<div>
			<ul className="list-group list-group-flush py-4">
				{posts?.pages.map((page, pageIndex) => (
					<React.Fragment key={pageIndex}>
						{page.posts.map((post) => (
							<PostItem
								key={post.id}
								id={post.id}
								title={post.title}
								createdAt={post.createdAt}
								summary={post.contents}
								author={post.author}
							/>
						))}
					</React.Fragment>
				))}
			</ul>
			{isFetchingNextPage && <p>더 불러오는 중...</p>}
			{hasNextPage ? (
				<button
					onClick={() => fetchNextPage()}
					disabled={isFetchingNextPage}
				>
					{isFetchingNextPage ? '로딩 중...' : '로드 더 보기'}
				</button>
			) : (
				<p>모든 게시글을 불러왔습니다.</p>
			)}
			<ScrollToTopButton />
		</div>
	);
};

export default PostList;
