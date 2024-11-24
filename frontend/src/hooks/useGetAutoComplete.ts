import { useQuery } from '@tanstack/react-query';
import { getAutoComplete } from 'apis/getAutoComplete';

export const useGetAutoComplete = (value: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['keyword', value],
		queryFn: () => getAutoComplete(value),
	});

	return {
		data,
		isLoading,
		error,
	};
};
