import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from 'apis/deletePost';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { queryKeys } from 'utils/queryKeys';

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: (id: string) => deletePost(id),
		onSuccess: (data) => {
			toast.success(data.message, {
				position: 'top-right',
			});
			queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
			navigate('/');
		},
		onError: (error) => {
			const errorResponse = (error as AxiosError<{ message: string }>)
				.response;

			toast.error(errorResponse?.data.message, {
				position: 'top-right',
			});
		},
	});
};
