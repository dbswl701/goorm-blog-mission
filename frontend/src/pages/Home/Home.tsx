import useAuth from '@hooks/useAuth';
import PostList from '@components/PostList';

const Home = () => {
	const username = useAuth();
	if (username === '') {
		location.href = '/login';
		return;
	}

	return (
		<div>
			<PostList />
		</div>
	);
};

export default Home;
