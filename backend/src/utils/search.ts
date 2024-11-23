export const buildSearchCondition = (search: string, searchBy: string) => {
	if (!search) return {};

	const searchRegex = new RegExp(search, 'i'); // 대소문자 구분 없는 정규식

	switch (searchBy) {
		case 'author':
			return { 'author.username': searchRegex };
		case 'title':
			return { title: searchRegex };
		case 'contents':
			return { contents: searchRegex };
		case 'all':
		default:
			return {
				$or: [
					{ 'author.username': searchRegex },
					{ title: searchRegex },
					{ contents: searchRegex },
				],
			};
	}
};
