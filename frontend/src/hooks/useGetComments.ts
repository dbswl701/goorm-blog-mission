import { useQuery } from '@tanstack/react-query';
import { getComments } from 'apis/getComments';

export const useGetComments = (id: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['comment', id],
		queryFn: () => getComments(id),
	});

	return {
		data,
		isLoading,
		error,
	};
};
