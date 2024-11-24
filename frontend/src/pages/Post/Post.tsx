import { useParams } from 'react-router-dom';
import PostContainer from '@containers/PostContainer';
import ConfirmModal from '@components/ConfirmModal';
import Comment from '@components/Comment';
import { useState } from 'react';
import { useDeletePost } from '@hooks/useDeletePost';

const Post = ({ username }: { username: string | null }) => {
	if (username === '') {
		location.href = '/login';
		return;
	}

	const { id } = useParams();
	if (!id) {
		location.href = '/';
		return;
	}

	const [isModalOpen, setModalOpen] = useState(false);

	const { mutate: deletePost } = useDeletePost();

	const handleDeleteClick = () => {
		setModalOpen(true);
	};

	const handleConfirmDelete = () => {
		setModalOpen(false);
		if (id) {
			deletePost(id);
		}
	};

	const handleCancelDelete = () => {
		setModalOpen(false);
	};

	return (
		<div>
			<PostContainer id={id} handleDeleteClick={handleDeleteClick} />
			<Comment postId={id} />
			<ConfirmModal
				isOpen={isModalOpen}
				message="게시글을 삭제하시겠습니까?"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
			/>
		</div>
	);
};

export default Post;
