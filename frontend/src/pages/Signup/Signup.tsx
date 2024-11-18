import useAuth from '@hooks/useAuth';
import LoginForm from '@components/LoginForm';

const Signup = () => {
	const username = useAuth();

	if (username) {
		location.href = '/';
		return;
	}

	return <LoginForm type="signup" />;
};

export default Signup;
