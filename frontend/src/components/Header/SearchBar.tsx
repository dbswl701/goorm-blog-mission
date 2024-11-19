import './Header.css';

const SearchBar = () => {
	return (
		<div className="search-bar">
			<form>
				<input placeholder="검색어를 입력하세요..." />
				<button>검색</button>
			</form>
		</div>
	);
};
export default SearchBar;
