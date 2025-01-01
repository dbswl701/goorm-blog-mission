import styles from './ProfileMenu.module.scss';

interface IProps {
	onClose: () => void;
	username: string;
	onLogout: () => void;
}

const ProfileMenu = ({ onClose, username, onLogout }: IProps) => {
	return (
		<div className={styles.profileMenuContainer}>
			<div className={styles.profileMenu}>
				<div className={styles.profileMenuHeader}>
					<span>{username}</span>
					<button onClick={onClose} aria-label="닫기">
						x
					</button>
				</div>
				<ul>
					<li>
						<span onClick={onLogout}>로그아웃</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default ProfileMenu;
