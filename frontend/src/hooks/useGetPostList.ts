import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostList, PostsResponse } from 'apis/getPostList';

export const useGetPostList = () => {
	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery<PostsResponse, Error>({
		queryKey: ['posts'],
		queryFn: ({ pageParam = 1 }) => getPostList({ pageParam }),
		getNextPageParam: (lastPage) => {
			const nextPage = lastPage.page + 1;
			return nextPage <= lastPage.totalPage ? nextPage : undefined;
		},
		initialPageParam: 1,
	});

	return {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};
