import { useState } from 'react';
import { FaPlus, FaSearch, FaTimes, FaUserCircle } from 'react-icons/fa';
import SearchBar from '../SearchBar';
import ProfileMenu from '../ProfileMenu';

interface HeaderUserProps {
	username: string | null;
	onLogout: () => void;
}

const HeaderUser = ({ username, onLogout }: HeaderUserProps) => {
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

	return (
		// <ul className="navbar-nav">
		// 	<li className="nav-item">
		// 		{username ? (
		// 			<span>
		// 				{username}{' '}
		// 				<button
		// 					className="btn btn-link link-danger"
		// 					onClick={onLogout}
		// 				>
		// 					Logout
		// 				</button>
		// 			</span>
		// 		) : (
		// 			<a className="nav-link" href="/login">
		// 				Login
		// 			</a>
		// 		)}
		// 	</li>
		// </ul>
		<div>
			<button onClick={toggleSearch}>
				{isSearchOpen ? <FaTimes /> : <FaSearch />}
			</button>
			{username ? (
				<>
					<button>
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

			<div
				className={`search-bar-container ${isSearchOpen ? 'open' : ''}`}
			>
				{isSearchOpen && <SearchBar />}
			</div>
		</div>
	);
};

export default HeaderUser;
