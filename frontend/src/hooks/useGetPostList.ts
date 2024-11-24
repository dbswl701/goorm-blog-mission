import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostList, PostsResponse } from 'apis/getPostList';
import { useSearchParams } from 'react-router-dom';

export const useGetPostList = () => {
	const [searchParams] = useSearchParams();
	const searchTerm = searchParams.get('search') || '';
	const sortOption = searchParams.get('sort') || '';
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
			return getPostList({
				pageParam,
				search: searchTerm,
				sort: sortOption,
			});
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
