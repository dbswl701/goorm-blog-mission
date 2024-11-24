import axios from 'axios';
import { IComment } from '@type/post';

export const postComment = async (
	id: string,
	content: string
): Promise<IComment[]> => {
	const res = await axios.post(
		`${import.meta.env.VITE_SERVER_URL}/posts/${id}/comments`,
		{ content }
	);

	if (!res.data.success) {
		throw new Error(res.data.message || '댓글을 작성하는데 실패했습니다.');
	}

	return res.data.data; // 성공 시 댓글 리스트 반환
};
