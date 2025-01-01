import PostList from '@components/PostList';
import SortBar from '@components/SortBar';

const Home = ({ username }: { username: string | null }) => {
	// const username = useAuth();
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
