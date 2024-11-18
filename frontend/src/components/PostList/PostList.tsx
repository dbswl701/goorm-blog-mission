import { useState, useEffect } from 'react';
import axios from 'axios';

import { PostInterface } from '@type/post';

import PostItem from '@components/PostListItem';

const PostList = () => {
	const [posts, setPosts] = useState<PostInterface[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					`${import.meta.env.VITE_SERVER_URL}/posts`
				);

				setPosts(data);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, []);

	return (
		<ul className="list-group list-group-flush py-4">
			{posts.map((post) => (
				<PostItem
					key={post.id}
					id={post.id}
					title={post.title}
					createdAt={post.createdAt}
					summary={post.contents}
					author={post.author}
				/>
			))}
		</ul>
	);
};

export default PostList;
