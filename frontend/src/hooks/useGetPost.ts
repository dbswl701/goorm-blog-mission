import { useQuery } from '@tanstack/react-query';
import { getPost } from 'apis/getPost';

export const useGetPost = (id?: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['post', id],
		queryFn: () => getPost(id!),
		enabled: !!id, // id가 존재할 때만 쿼리 실행
	});

	return {
		data,
		isLoading,
		error,
	};
};
