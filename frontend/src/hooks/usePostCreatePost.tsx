import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCreatePost } from 'apis/postCreatePost';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const usePostCreatePost = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: ({
			title,
			contents,
		}: {
			title: string;
			contents: string;
		}) => postCreatePost(title, contents),
		onSuccess: (data) => {
			console.log('데이터 잘 보냄: ', data);
			toast.success('게시글이 성공적으로 등록되었습니다!', {
				position: 'top-right',
			});
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			navigate('/');
		},
		onError: (error) => {
			console.log(error);
			toast.error('게시글 등록에 실패했습니다. 다시 시도해주세요.', {
				position: 'top-right',
			});
		},
	});
};
