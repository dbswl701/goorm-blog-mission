import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './SortBar.module.scss';

const SortBar = () => {
	const [sort, setSort] = useState('latest');
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const currentSort = searchParams.get('sort') || '';
		setSort(currentSort || 'latest');
	}, [searchParams]);

	const handleSortChange = (selectedSort: string) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('sort', selectedSort);
		setSearchParams(newSearchParams);
	};

	return (
		<div className={styles['sort-bar']}>
			<button
				className={`${styles['sort-button']} ${
					sort === 'latest' ? styles.active : ''
				}`}
				onClick={() => handleSortChange('latest')}
			>
				최신순
			</button>
			<button
				className={`${styles['sort-button']} ${
					sort === 'oldest' ? styles.active : ''
				}`}
				onClick={() => handleSortChange('oldest')}
			>
				오래된순
			</button>
			<button
				className={`${styles['sort-button']} ${
					sort === 'likes' ? styles.active : ''
				}`}
				onClick={() => handleSortChange('likes')}
			>
				좋아요순
			</button>
			<button
				className={`${styles['sort-button']} ${
					sort === 'comments' ? styles.active : ''
				}`}
				onClick={() => handleSortChange('comments')}
			>
				댓글순
			</button>
		</div>
	);
};

export default SortBar;
