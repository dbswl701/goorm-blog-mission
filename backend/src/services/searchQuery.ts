import searchQueryModel from '../models/searchQuery/schema';

// 검색 수행 시 없으면 검색어를 저장, 있다면 count 증가
export const logSearchQuery = async (query: string): Promise<void> => {
	if (!query) return;

	const existingQuery = await searchQueryModel.findOne({ query });

	if (existingQuery) {
		existingQuery.count += 1;
		await existingQuery.save();
	} else {
		const newSearchQuery = new searchQueryModel({ query });
		await newSearchQuery.save();
	}
};

// 입력 문자열을 기반으로 자동 완성 제안 반환.
export const getAutocompleteSuggestions = async (
	partial: string,
	limit: number = 5
): Promise<string[]> => {
	if (!partial) return [];

	const suggestions = await searchQueryModel
		.find({ query: { $regex: `^${partial}`, $options: 'i' } })
		.sort({ count: -1 })
		.limit(limit)
		.select('query -_id')
		.exec();

	return suggestions.map((item) => item.query);
};
