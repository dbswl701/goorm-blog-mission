import { FilterQuery } from 'mongoose';
import { PostSchema } from '../models/post/schema';

export const buildSearchCondition = (search: string, searchBy: string) => {
	if (!search) return {};

	// const searchRegex = new RegExp(search, 'i'); // 대소문자 구분 없는 정규식

	// switch (searchBy) {
	// 	case 'author':
	// 		// ObjectId에서 이름 찾는거 나중에 User 스키마와 조인 필요.(lookup)
	// 		return { 'author.username': searchRegex };
	// 	case 'title':
	// 		return { title: searchRegex };
	// 	case 'contents':
	// 		return { contents: searchRegex };
	// 	case 'all':
	// 	default:
	// 		return {
	// 			$or: [
	// 				{ 'author.username': searchRegex },
	// 				{ title: searchRegex },
	// 				{ contents: searchRegex },
	// 			],
	// 		};
	// }

	if (searchBy === 'all') {
		return { $text: { $search: search } };
	}

	// 특정 필드 검색
	const condition: FilterQuery<PostSchema> = {};
	if (searchBy === 'title') {
		condition.title = { $regex: search, $options: 'i' };
	} else if (searchBy === 'contents') {
		condition.contents = { $regex: search, $options: 'i' };
	} else if (searchBy === 'author') {
		condition.author = search; // 실제로는 author ID로 검색하거나, 이름을 검색할 때는 다른 접근 방식 필요
	}

	return condition;
};
