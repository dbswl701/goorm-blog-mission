import { useParams } from 'react-router-dom';

import useAuth from '@hooks/useAuth';
import PostContainer from '@containers/PostContainer';

const Post = () => {
	const username = useAuth();
	if (username === '') {
		location.href = '/login';
		return;
	}

	const { id } = useParams();
	if (!id) {
		location.href = '/';
		return;
	}

	return (
		<div>
			<PostContainer id={id} />
		</div>
	);
};

export default Post;
