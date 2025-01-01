import React, { useEffect } from 'react';
import PostItem from '@components/PostListItem';
import { useGetPostList } from '@hooks/useGetPostList';
import ScrollToTopButton from '@components/ScrollToTopButton';
import { useLocation } from 'react-router-dom';
import styles from './PostList.module.scss';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import PostListSkeleton from '@components/PostListItem/PostListItem.skeleton';

export interface Post {
	id: string;
	title: string;
	content: string;
	// 필요한 다른 필드들
	createdAt: string;
	contents: string;
	author: string;
	isLikedByUser: boolean;
	likeCount: number;
	commentCount: number;
}

const PostList = () => {
	const {
		data: posts,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetPostList();

	const location = useLocation();

	useEffect(() => {
		refetch();
	}, [location.search]);

	// if (isLoading) return <div>로딩중</div>;
	if (isLoading) {
		return <PostListSkeleton />;
	}
	if (error) return <div>에러</div>;
	console.log('posts: ', posts, 'hasNextPage: ', hasNextPage);
	return (
		<section>
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
								likeCount={post.likeCount}
								commentCount={post.commentCount}
							/>
						))}
					</React.Fragment>
				))}
			</ul>
			{isFetchingNextPage && <PostListSkeleton />}
			{hasNextPage && (
				<button
					onClick={() => fetchNextPage()}
					className={styles.loadMoreButton}
					aria-label="게시글 더 보기"
				>
					<IoIosArrowDropdownCircle />
				</button>
			)}
			<ScrollToTopButton />
		</section>
	);
};

export default PostList;
