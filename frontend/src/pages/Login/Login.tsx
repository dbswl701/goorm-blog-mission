import useAuth from '@hooks/useAuth';
import LoginForm from '@components/LoginForm';

const Login = () => {
	const username = useAuth();
	if (username) {
		location.href = '/';
		return;
	}

	return <LoginForm type="login" />;
};

export default Login;
