import './Header.css';

interface IProps {
	onClose: () => void;
	username: string;
	onLogout: () => void;
}

const ProfileMenu = ({ onClose, username, onLogout }: IProps) => {
	return (
		<div className="profile-menu">
			<div className="profile-menu-header">
				<span>{username}</span>
				<button onClick={onClose}>x</button>
			</div>
			<ul>
				<li>
					<a href="/lian">내 블로그</a>
				</li>
				<li>
					<a href="/post">새 글 작성</a>
				</li>
				<li>
					<span onClick={onLogout}>로그아웃</span>
				</li>
			</ul>
		</div>
	);
};

export default ProfileMenu;
