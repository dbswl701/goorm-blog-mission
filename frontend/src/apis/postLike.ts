import { ErrorResponse, SuccessResponse } from '@type/post';
import axios from 'axios';

export const postLike = async (
	postId: string,
	isLiked: boolean
): Promise<SuccessResponse | ErrorResponse> => {
	if (!isLiked) {
		const res = await axios.post(
			`${import.meta.env.VITE_SERVER_URL}/posts/${postId}/like`
		);
		return res.data;
	} else {
		const res = await axios.post(
			`${import.meta.env.VITE_SERVER_URL}/posts/${postId}/unlike`
		);
		return res.data;
	}
};
