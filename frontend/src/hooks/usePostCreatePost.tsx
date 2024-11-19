import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCreatePost } from 'apis/postCreatePost';

export const usePostCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			title,
			contents,
		}: {
			title: string;
			contents: string;
		}) => postCreatePost(title, contents),
		onSuccess: (data) => {
			// 나중에 toast 보여주기
			console.log('데이터 잘 보냄: ', data);
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		},
		onError: () => {
			// toast
			console.log('에러 발생');
		},
	});
};
