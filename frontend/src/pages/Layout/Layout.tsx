import { Outlet } from 'react-router-dom';
import axios from 'axios';

import useAuth from '@hooks/useAuth';
import HeaderTitle from '@components/HeaderTitle';
import HeaderUser from '@components/HeaderUser';

import styles from './Layout.module.scss';

const Layout = () => {
	const username = useAuth();

	const onLogout = () => {
		axios.get('/auth/logout').then(({ data }) => {
			if (data?.result) {
				location.href = '/';
			}
		});
	};

	return (
		<>
			<header className="fixed-top">
				<nav className="navbar navbar-light bg-light px-4">
					<HeaderTitle />
					<HeaderUser username={username} onLogout={onLogout} />
				</nav>
			</header>
			<main className={styles.Layout__main}>
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
