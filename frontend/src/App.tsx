import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Layout from '@pages/Layout';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Signup from '@pages/Signup';
import Post from '@pages/Post';
import Write from '@pages/Write/Write';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '@hooks/useAuth';

function App() {
	const username = useAuth();

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout username={username} />}>
						<Route
							path="/"
							element={<Home username={username} />}
						/>
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<Signup />} />
						<Route
							path="posts/:id"
							element={<Post username={username} />}
						/>
						<Route
							path="write"
							element={<Write username={username} />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
			<ToastContainer />
		</div>
	);
}

export default App;
