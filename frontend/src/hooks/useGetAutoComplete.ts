import { useQuery } from '@tanstack/react-query';
import { getAutoComplete } from 'apis/getAutoComplete';
import { queryKeys } from 'utils/queryKeys';

export const useGetAutoComplete = (value: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: queryKeys.autoComplete(value), // Query Key Factory 사용
		queryFn: () => getAutoComplete(value),
		gcTime: 5 * 60 * 1000, // 캐시 데이터 유효 시간: 5분
		staleTime: 0.5 * 60 * 1000, // 데이터 신선 상태 유지 시간: 1분
	});

	return {
		data,
		isLoading,
		error,
	};
};
