import HeaderTitle from '@components/Header/HeaderTitle';
import HeaderUser from '@components/Header/HeaderUser';
import useAuth from '@hooks/useAuth';
import axios from 'axios';
import { useState } from 'react';
import { FaPlus, FaSearch, FaTimes, FaUserCircle } from 'react-icons/fa';
import ProfileMenu from './ProfileMenu';
import SearchBar from './SearchBar';
import './Header.css';
import { useNavigate } from 'react-router-dom';
const Header = () => {
	const username = useAuth();
	const navigate = useNavigate();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

	const toggleProfileMenu = () => {
		setIsProfileMenuOpen((prev) => !prev);
	};

	const closeProfileMenu = () => {
		setIsProfileMenuOpen(false);
	};

	const toggleSearch = () => {
		setIsSearchOpen((prev) => !prev);
	};
	const onLogout = () => {
		axios.get('/auth/logout').then(({ data }) => {
			if (data?.result) {
				location.href = '/';
			}
		});
	};

	return (
		<header className="fixed-top">
			<nav className="navbar navbar-light bg-light px-4 position-relative">
				<a className="navbar-brand" href="/">
					goorm Blog
				</a>
				{/* <HeaderUser username={username} onLogout={onLogout} /> */}
				<div>
					<button onClick={toggleSearch}>
						{isSearchOpen ? <FaTimes /> : <FaSearch />}
					</button>
					{username ? (
						<>
							<button onClick={() => navigate('/write')}>
								<FaPlus />
							</button>
							<button onClick={toggleProfileMenu}>
								<FaUserCircle />
							</button>
							{isProfileMenuOpen && (
								<ProfileMenu
									onClose={closeProfileMenu}
									username={username}
									onLogout={onLogout}
								/>
							)}
						</>
					) : (
						<a className="nav-link" href="/login">
							Login
						</a>
					)}
				</div>
				<div
					className={`search-bar-container ${isSearchOpen ? 'open' : ''}`}
				>
					{isSearchOpen && <SearchBar />}
				</div>
			</nav>
		</header>
	);
};

export default Header;
