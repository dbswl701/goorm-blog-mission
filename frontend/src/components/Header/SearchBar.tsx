import { useEffect, useState } from 'react';
import './Header.css';
import { useSearchParams } from 'react-router-dom';

const SearchBar = () => {
	const [search, setSearch] = useState('');

	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const currentSearch = searchParams.get('search') || '';
		setSearch(currentSearch);
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// 현재 쿼리 파라미터를 복사
		const newSearchParams = new URLSearchParams(searchParams);

		newSearchParams.set('search', search.trim()); // search 파라미터 설정

		// 쿼리 파라미터 업데이트
		setSearchParams(newSearchParams);
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
