import ConfirmModal from '@components/ConfirmModal';
import Post from '@components/Post';
import { useGetPost } from '@hooks/useGetPost';
import { useState } from 'react';
import { useDeletePost } from '@hooks/useDeletePost';
import Comment from '@components/Comment';

interface PostContainernterface {
	id: string;
}

const PostContainer = ({ id }: PostContainernterface) => {
	const { data, isLoading, error } = useGetPost(id);

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
		<>
			{data && (
				<Post
					title={data.title}
					contents={data.contents}
					author={data.author}
					createdAt={data.createdAt}
					id={data.id}
					likeCount={data.likeCount}
					isLikedByUser={data.isLikedByUser}
					handleDeleteClick={handleDeleteClick}
				/>
			)}
			<Comment postId={id} />
			<ConfirmModal
				isOpen={isModalOpen}
				message="게시글을 삭제하시겠습니까?"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
			/>
		</>
	);
};

export default PostContainer;
