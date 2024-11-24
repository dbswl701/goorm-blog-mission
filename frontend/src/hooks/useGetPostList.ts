import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getPostList, PostsResponse } from 'apis/getPostList';
import { useLocation } from 'react-router-dom';

export const useGetPostList = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const searchTerm = params.get('search') || '';
	const sortOption = params.get('sort') || '';
	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery<PostsResponse, Error>({
		queryKey: ['posts'],
		queryFn: ({ pageParam = 1 }) => {
			return getPostList({ pageParam, search: searchTerm });
		},
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
		refetch,
	};
};
