import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Layout from '@pages/Layout';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Signup from '@pages/Signup';
import Post from '@pages/Post';
import Write from '@pages/Write/Write';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="/" element={<Home />} />
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<Signup />} />
						<Route path="posts/:id" element={<Post />} />
						<Route path="write" element={<Write />} />
					</Route>
				</Routes>
			</BrowserRouter>
			<ToastContainer />
		</div>
	);
}

export default App;
