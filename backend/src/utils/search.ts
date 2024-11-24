import { FilterQuery } from 'mongoose';
import { PostSchema } from '../models/post/schema';

export const buildSearchCondition = (search: string, searchBy: string) => {
	if (!search) return {};
	if (searchBy === 'all') {
		return { $text: { $search: search, $language: 'none' } };
	}

	// 특정 필드 검색
	const condition: FilterQuery<PostSchema> = {};
	if (searchBy === 'title') {
		condition.title = { $regex: search, $options: 'i' };
	} else if (searchBy === 'contents') {
		condition.contents = { $regex: search, $options: 'i' };
	} else if (searchBy === 'author') {
		return {};
	}

	return condition;
};
