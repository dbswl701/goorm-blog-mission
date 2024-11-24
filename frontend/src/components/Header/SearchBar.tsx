import { useEffect, useState } from 'react';
import styles from './SearchBar.module.scss';
import { useSearchParams } from 'react-router-dom';
import AutoComplete from '@components/AutoComplete';
import './Header.css';
const SearchBar = () => {
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('all');
	const [searchParams, setSearchParams] = useSearchParams();

	const filterList = [
		{ label: '제목+내용', value: 'all' },
		{ label: '제목', value: 'title' },
		{ label: '내용', value: 'contents' },
		{ label: '작성자', value: 'author' },
	];

	useEffect(() => {
		const currentSearch = searchParams.get('search') || '';
		const currentFilter = searchParams.get('filter') || 'all';

		setSearch(currentSearch);
		setFilter(currentFilter);
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('search', search.trim());
		newSearchParams.set('filter', filter);

		setSearchParams(newSearchParams);
	};

	const handleFilterChange = (selectedFilter: string) => {
		setFilter(selectedFilter);
	};

	const selectedFilterLabel =
		filterList.find((item) => item.value === filter)?.label || '필터';

	return (
		<div className={styles.container}>
			<form className={styles.searchBar} onSubmit={handleSubmit}>
				<div className="input-group">
					<button
						className={`btn btn-outline-secondary dropdown-toggle ${styles.dropdownButton}`}
						type="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						{selectedFilterLabel}
					</button>
					<ul className={`dropdown-menu ${styles.dropdownMenu}`}>
						{filterList.map((item) => (
							<li
								key={item.value}
								onClick={() => handleFilterChange(item.value)}
							>
								<p className="dropdown-item">{item.label}</p>
							</li>
						))}
					</ul>

					<input
						type="text"
						className="form-control"
						aria-label="Text input with dropdown button"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<button type="submit" className="search-button">
					검색
				</button>
			</form>
			<AutoComplete value={search} onChange={setSearch} />
		</div>
	);
};
export default SearchBar;
