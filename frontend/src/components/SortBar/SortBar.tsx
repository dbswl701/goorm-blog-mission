import { useEffect, useState } from 'react';
import './SortBar.module.scss';
import { useSearchParams } from 'react-router-dom';
const SortBar = () => {
	const [sort, setSort] = useState('');
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const currentSort = searchParams.get('sort') || '';
		setSort(currentSort);
	}, [searchParams]);

	const handleSortChange = (selectedSort: string) => {
		// 현재 쿼리 파라미터를 복사
		const newSearchParams = new URLSearchParams(searchParams);

		newSearchParams.set('sort', selectedSort); // sort 파라미터 설정

		// 쿼리 파라미터 업데이트
		setSearchParams(newSearchParams);
	};

	return (
		<div className="sort-bar">
			<button
				className={`sort-button ${sort === 'latest' ? 'active' : ''}`}
				onClick={() => handleSortChange('latest')}
			>
				최신순
			</button>
			<button
				className={`sort-button ${sort === 'oldest' ? 'active' : ''}`}
				onClick={() => handleSortChange('oldest')}
			>
				오래된순
			</button>
			<button
				className={`sort-button ${sort === 'likes' ? 'active' : ''}`}
				onClick={() => handleSortChange('likes')}
			>
				좋아요순
			</button>
			<button
				className={`sort-button ${sort === 'comments' ? 'active' : ''}`}
				onClick={() => handleSortChange('comments')}
			>
				댓글순
			</button>
		</div>
	);
};

export default SortBar;
