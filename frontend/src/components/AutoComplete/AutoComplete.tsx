import React, { useState, useEffect } from 'react';
import styles from './AutoComplete.module.scss';
import { useGetAutoComplete } from '@hooks/useGetAutoComplete';
import useDebounce from '@hooks/useDebounce';

interface AutocompleteProps {
	value: string;
	onChange: (value: string) => void;
}

const AutoComplete: React.FC<AutocompleteProps> = ({ value, onChange }) => {
	const debounceSearchValue = useDebounce<string>(value);
	const { data: suggestions, isLoading } =
		useGetAutoComplete(debounceSearchValue);
	const [activeIndex, setActiveIndex] = useState<number>(-1);

	// 항목 클릭 핸들러
	const handleSuggestionClick = (suggestion: string) => {
		onChange(suggestion);
	};

	// 키보드 이벤트 핸들러
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!suggestions) return;

		if (e.key === 'ArrowDown') {
			setActiveIndex((prevIndex) =>
				prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
			);
		} else if (e.key === 'ArrowUp') {
			setActiveIndex((prevIndex) =>
				prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
			);
		} else if (e.key === 'Enter' && activeIndex >= 0) {
			onChange(suggestions[activeIndex]);
		}
	};

	return (
		<div className={styles.autocomplete}>
			{!isLoading && suggestions && suggestions.length > 0 && (
				<ul className={styles.suggestionsList}>
					{suggestions.map((suggestion, index) => (
						<li
							key={index}
							onClick={() => handleSuggestionClick(suggestion)}
							className={`${styles.suggestionItem} ${
								index === activeIndex ? styles.active : ''
							}`}
						>
							{suggestion}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default AutoComplete;
