import HeaderTitle from '@components/Header/HeaderTitle';
import HeaderUser from '@components/Header/HeaderUser';
import useAuth from '@hooks/useAuth';
import axios from 'axios';
import { useState } from 'react';

const Header = () => {
	const username = useAuth();

	const onLogout = () => {
		axios.get('/auth/logout').then(({ data }) => {
			if (data?.result) {
				location.href = '/';
			}
		});
	};

	return (
		<header className="fixed-top">
			<nav className="navbar navbar-light bg-light px-4">
				<HeaderTitle />
				<HeaderUser username={username} onLogout={onLogout} />
			</nav>
		</header>
	);
};

export default Header;
