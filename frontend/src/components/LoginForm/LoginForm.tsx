import React, { useState } from 'react';
import axios from 'axios';
import cx from 'classnames';

import styles from './LoginForm.module.scss';

interface LoginFormProps {
	type: 'signup' | 'login';
}

interface UrlMapInterface {
	signup: string;
	login: string;
}

const LoginForm = ({ type }: LoginFormProps) => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');

	const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const URL_MAP: UrlMapInterface = {
			signup: '/auth/signup',
			login: '/auth/login',
		};
		const FALLBACK_URL: string = URL_MAP.signup;

		try {
			const { data } = await axios.post(URL_MAP[type] || FALLBACK_URL, {
				username,
				password,
			});

			if (data) {
				if (type === 'signup') {
					location.href = '/login';
					return;
				}

				location.href = '/';
			}
		} catch (error: any) {
			setError(error.response?.data?.message || 'Please try again');
		}
	};

	return (
		<div className={cx(styles.LoginForm, 'container-fluid')}>
			{error && (
				<div className="alert alert-danger" role="alert">
					{error}
				</div>
			)}
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						className="form-control"
						id="username"
						aria-describedby="usernameHelp"
						placeholder="john.doe"
						value={username}
						onChange={onChangeUsername}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						className="form-control"
						id="password"
						placeholder="Your Password"
						value={password}
						onChange={onChangePassword}
					/>
				</div>
				<button type="submit" className="btn btn-primary d-block w-100">
					{type === 'signup' ? 'Signup' : 'Login'}
				</button>
				<div className="text-center">
					<a
						className="form-text text-muted pt-2"
						href={type === 'signup' ? '/login' : '/signup'}
					>
						Or {type === 'signup' ? 'Login' : 'Signup'}
					</a>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
