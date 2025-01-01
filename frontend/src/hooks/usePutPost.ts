import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putPost } from 'apis/putPost';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const usePutPost = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: ({
			id,
			title,
			contents,
		}: {
			id: string;
			title: string;
			contents: string;
		}) => putPost(id, title, contents),
		onSuccess: () => {
			toast.success(`게시글이 성공적으로 수정되었습니다!`, {
				position: 'top-right',
			});
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			navigate('/');
		},
		onError: (error) => {
			console.log(error);
			toast.error(`게시글 수정에 실패했습니다. 다시 시도해주세요.`, {
				position: 'top-right',
			});
		},
	});
};
