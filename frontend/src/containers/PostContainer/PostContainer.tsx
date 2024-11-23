import Post from '@components/Post';
import { useGetPost } from '@hooks/useGetPost';

interface PostContainernterface {
	id: string;
}

const PostContainer = ({ id }: PostContainernterface) => {
	const { data, isLoading, error } = useGetPost(id);

	return (
		data && (
			<Post
				title={data.title}
				contents={data.contents}
				author={data.author}
				createdAt={data.createdAt}
				id={data.id}
			/>
		)
	);
};

export default PostContainer;
