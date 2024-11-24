import { useQuery } from '@tanstack/react-query';
import { getComments } from 'apis/getComments';
import { queryKeys } from 'utils/queryKeys';

export const useGetComments = (id: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: queryKeys.comments(id),
		queryFn: () => getComments(id),
		gcTime: 5 * 60 * 1000, // 캐시 데이터 유효 시간: 5분
		staleTime: 1 * 60 * 1000, // 데이터 신선 상태 유지 시간: 1분
	});

	return {
		data,
		isLoading,
		error,
	};
};
