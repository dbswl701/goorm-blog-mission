import Post from '@components/Post';
import { useGetPost } from '@hooks/useGetPost';
interface PostContainernterface {
	id: string;
	handleDeleteClick: () => void;
}

const PostContainer = ({ id, handleDeleteClick }: PostContainernterface) => {
	const { data, isLoading, error } = useGetPost(id);

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
		</>
	);
};

export default PostContainer;
