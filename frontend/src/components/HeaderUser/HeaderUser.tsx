interface HeaderUserProps {
	username: string | null;
	onLogout: () => void;
}

const HeaderUser = ({ username, onLogout }: HeaderUserProps) => (
	<ul className="navbar-nav">
		<li className="nav-item">
			{username ? (
				<span>
					{username}{' '}
					<button
						className="btn btn-link link-danger"
						onClick={onLogout}
					>
						Logout
					</button>
				</span>
			) : (
				<a className="nav-link" href="/login">
					Login
				</a>
			)}
		</li>
	</ul>
);

export default HeaderUser;
