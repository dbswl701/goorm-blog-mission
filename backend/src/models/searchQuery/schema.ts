import { Schema, model, Types } from 'mongoose';

interface SearchQuerySchema {
	query: string;
	count: number;
	createdAt: Date;
	updatedAt: Date;
}

const searchQuerySchema = new Schema<SearchQuerySchema>(
	{
		query: { type: String, required: true, unique: true },
		count: { type: Number, default: 1 },
	},
	{
		timestamps: true,
	}
);

const searchQueryModel = model<SearchQuerySchema>(
	'SearchQuery',
	searchQuerySchema
);

export default searchQueryModel;
