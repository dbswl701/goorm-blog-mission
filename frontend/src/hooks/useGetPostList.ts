import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostList, PostsResponse } from 'apis/getPostList';
import { useSearchParams } from 'react-router-dom';
import { queryKeys } from 'utils/queryKeys';

export const useGetPostList = () => {
	const [searchParams] = useSearchParams();
	const searchTerm = searchParams.get('search') || '';
	const sortOption = searchParams.get('sort') || '';
	const filterOption = searchParams.get('filter') || 'all';
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
		queryKey: queryKeys.posts(searchTerm, sortOption, filterOption), // Query Key Factory 사용
		queryFn: ({ pageParam = 1 }) => {
			return getPostList({
				pageParam,
				search: searchTerm,
				sort: sortOption,
				filter: filterOption,
			});
		},
		getNextPageParam: (lastPage) => {
			const nextPage = lastPage.page + 1;
			return nextPage <= lastPage.totalPage ? nextPage : undefined;
		},
		initialPageParam: 1,
		gcTime: 5 * 60 * 1000, // 캐시 데이터 유효 시간: 5분
		staleTime: 1 * 60 * 1000, // 데이터 신선 상태 유지 시간: 1분
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
