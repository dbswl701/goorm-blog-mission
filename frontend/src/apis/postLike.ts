import axios from 'axios';

export const postLike = async (
	postId: string,
	isLiked: boolean
): Promise<{ data: string }> => {
	if (!isLiked) {
		const res = await axios.post(`/posts/${postId}/like`);
		return res.data.data;
	} else {
		const res = await axios.post(`/posts/${postId}/unlike`);
		return res.data.data;
	}
};
