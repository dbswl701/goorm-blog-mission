export const buildSortCondition = (sort: string) => {
	let sortCondition: any = {};

	switch (sort) {
		case 'likes':
			sortCondition = { likeCount: -1 };
			break;
		case 'unlikes':
			sortCondition = { likeCount: 1 };
			break;
		case 'comments':
			sortCondition = { commentCount: -1 };
			break;
		case 'oldest':
			sortCondition = { createdAt: 1 };
			break;
		case 'latest':
		default:
			sortCondition = { createdAt: -1 };
			break;
	}

	return sortCondition;
};
