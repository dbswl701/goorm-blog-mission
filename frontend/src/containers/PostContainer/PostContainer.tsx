import { useState, useEffect } from 'react';
import axios from 'axios';

import { PostInterface } from '@type/post';
import Post from '@components/Post';

interface PostContainernterface {
	id: string;
}

const PostContainer = ({ id }: PostContainernterface) => {
	const [data, setData] = useState<PostInterface | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					`${import.meta.env.VITE_SERVER_URL}/posts/${id}`
				);
				setData(data);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, []);

	return (
		data && (
			<Post
				title={data.title}
				contents={data.contents}
				author={data.author}
				createdAt={data.createdAt}
			/>
		)
	);
};

export default PostContainer;
