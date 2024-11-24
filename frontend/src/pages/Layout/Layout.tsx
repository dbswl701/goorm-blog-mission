import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import Header from '@components/Header';

const Layout = ({ username }: { username: string | null }) => {
	return (
		<>
			<Header username={username} />
			<main className={styles.Layout__main}>
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
