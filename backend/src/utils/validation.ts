import mongoose from 'mongoose';

export const isValidString = (value: any): boolean => {
	return typeof value === 'string' && value.trim().length > 0;
};

export const isValidObjectId = (id: string): boolean => {
	return mongoose.Types.ObjectId.isValid(id);
};
