import axios from 'axios';

export const postLike = async (
	postId: string,
	isLiked: boolean
): Promise<{ data: string }> => {
	if (!isLiked) {
		const res = await axios.post(
			`${import.meta.env.VITE_SERVER_URL}/posts/${postId}/like`
		);
		return res.data.data;
	} else {
		const res = await axios.post(
			`${import.meta.env.VITE_SERVER_URL}/posts/${postId}/unlike`
		);
		return res.data.data;
	}
};
