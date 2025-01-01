import { useQuery } from '@tanstack/react-query';
import { getPost } from 'apis/getPost';
import { queryKeys } from 'utils/queryKeys';

export const useGetPost = (id?: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: id ? queryKeys.post(id) : [], // Query Key Factory 사용
		queryFn: () => getPost(id!),
		enabled: !!id, // id가 존재할 때만 쿼리 실행
		gcTime: 5 * 60 * 1000, // 캐시 데이터 유효 시간: 5분
		staleTime: 1 * 60 * 1000, // 데이터 신선 상태 유지 시간: 1분
	});

	return {
		data,
		isLoading,
		error,
	};
};
