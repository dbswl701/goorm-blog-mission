import axios from 'axios';
import { useState } from 'react';
import { FaPlus, FaSearch, FaTimes, FaUserCircle } from 'react-icons/fa';
import ProfileMenu from './ProfileMenu';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = ({ username }: { username: string | null }) => {
	// const username = useAuth();
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
		<header className={styles.header}>
			<nav className={styles.container}>
				<a className={styles.logo} href="/">
					goorm Blog
				</a>

				<div className={styles.menu}>
					<button
						className={styles.iconButton}
						onClick={toggleSearch}
						aria-label={
							isSearchOpen ? '검색창 닫기' : '검색창 열기'
						}
						aria-expanded={isSearchOpen}
					>
						{isSearchOpen ? <FaTimes /> : <FaSearch />}
					</button>

					{username ? (
						<>
							<button
								className={styles.iconButton}
								onClick={() => navigate('/write')}
								aria-label="게시글 작성하기"
							>
								<FaPlus />
							</button>
							<button
								className={styles.iconButton}
								onClick={toggleProfileMenu}
								aria-label={
									isProfileMenuOpen
										? '프로필 메뉴 닫기'
										: '프로필 메뉴 열기'
								}
								aria-expanded={isProfileMenuOpen}
							>
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
						<a
							className={styles.iconButton}
							href="/login"
							aria-label="로그인 페이지로 이동"
						>
							Login
						</a>
					)}
				</div>
				{/* 검색창 추가 */}
				<div
					className={`${styles.searchBarContainer} ${
						isSearchOpen ? styles.open : ''
					}`}
				>
					{isSearchOpen && <SearchBar />}
				</div>
			</nav>
		</header>
	);
};

export default Header;
