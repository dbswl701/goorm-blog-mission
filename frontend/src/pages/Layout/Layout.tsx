import { Outlet } from 'react-router-dom';
import axios from 'axios';

import useAuth from '@hooks/useAuth';
import HeaderTitle from '@components/Header/HeaderTitle';
import HeaderUser from '@components/Header/HeaderUser';

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
