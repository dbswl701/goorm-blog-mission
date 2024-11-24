// src/components/Autocomplete.tsx
import React, { useState, useEffect } from 'react';
import './AutoComplete.css'; // 스타일링을 위한 CSS 파일
import { useGetAutoComplete } from '@hooks/useGetAutoComplete';
import useDebounce from '@hooks/useDebounce';

interface AutocompleteProps {
	value: string;
	onChange: (value: string) => void;
}

const AutoComplete: React.FC<AutocompleteProps> = ({ value, onChange }) => {
	// const [suggestions, setSuggestions] = useState<string[]>([]);
	const debounceSeachValue = useDebounce<string>(value);

	const {
		data: suggestions,
		isLoading,
		error,
	} = useGetAutoComplete(debounceSeachValue);

	// const suggestions = ['테스트1', '테스트2', '테스트3'];
	const handleSuggestionClick = (suggestion: string) => {
		onChange(suggestion);
	};

	console.log('suggest:', suggestions);

	return (
		<div className="autocomplete">
			{suggestions && suggestions.length > 0 && (
				<ul className="suggestions-list">
					{suggestions.map((suggestion: string, index: number) => (
						<li
							key={index}
							onClick={() => handleSuggestionClick(suggestion)}
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
