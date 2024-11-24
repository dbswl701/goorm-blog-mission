import { useEffect, useState } from 'react';
import './Header.css';
import { useGetPostList } from '@hooks/useGetPostList';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = () => {
	const [search, setSearch] = useState('');
	// const { refetch } = useGetPostList();

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const searchParams = params.get('search') || '';
		setSearch(searchParams);
	}, [location.search]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (search.trim().length >= 2) {
			// URL 쿼리 파라미터로 검색어 설정
			const params = new URLSearchParams(location.search);
			params.set('search', search.trim());
			navigate({
				pathname: location.pathname,
				search: params.toString(),
			});
		} else {
			toast.error('2자 이상 입력해주세요.', {
				position: 'top-right',
			});
		}
	};
	return (
		<div className="search-bar">
			<form onSubmit={handleSubmit}>
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="검색어를 입력하세요..."
				/>
				<button type="submit">검색</button>
			</form>
		</div>
	);
};
export default SearchBar;
