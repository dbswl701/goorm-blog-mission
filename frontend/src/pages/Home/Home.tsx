import useAuth from '@hooks/useAuth';
import PostList from '@components/PostList';
import SortBar from '@components/SortBar';

const Home = () => {
	const username = useAuth();
	if (username === '') {
		location.href = '/login';
		return;
	}

	return (
		<div>
			<SortBar />
			<PostList />
		</div>
	);
};

export default Home;
