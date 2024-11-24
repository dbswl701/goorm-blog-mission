import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import Header from '@components/Header';

const Layout = () => {
	return (
		<>
			<Header />
			<main className={styles.Layout__main}>
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
