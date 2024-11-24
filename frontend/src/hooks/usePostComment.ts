import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postComment } from 'apis/postComment';
import { toast } from 'react-toastify';

export const usePostComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			postId,
			content,
		}: {
			postId: string;
			content: string;
		}) => postComment(postId, content),
		onSuccess: (data) => {
			console.log(data);
			toast.success('댓글이 성공적으로 등록되었습니다!', {
				position: 'top-right',
			});
			queryClient.invalidateQueries({ queryKey: ['comment'] });
		},
		onError: (error) => {
			console.log(error);
			toast.error('댓글 등록에 실패했습니다. 다시 시도해주세요.', {
				position: 'top-right',
			});
		},
	});
};
