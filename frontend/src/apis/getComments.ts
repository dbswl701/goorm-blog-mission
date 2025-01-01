import axios from 'axios';
import { IComment } from '@type/post';

export const getComments = async (id: string): Promise<IComment[]> => {
	const res = await axios.get(`/posts/${id}/comments`);

	if (!res.data.success) {
		throw new Error(res.data.message || '댓글을 가져오는데 실패했습니다.');
	}

	return res.data.data; // 성공 시 댓글 리스트 반환
};
