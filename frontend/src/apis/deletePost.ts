import { DeletePostResposne } from '@type/post';
import axios from 'axios';

export const deletePost = async (id: string): Promise<DeletePostResposne> => {
	const res = await axios.delete(
		`${import.meta.env.VITE_SERVER_URL}/posts/${id}`
	);
	return res.data as DeletePostResposne;
};
