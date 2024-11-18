import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		axios.get('/auth/id').then(({ data }) => {
			setUsername(data.username || '');
		});
	}, []);

	return username;
};

export default useAuth;
