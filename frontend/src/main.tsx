import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import 'bootstrap';

import App from './App';
import './index.css';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
