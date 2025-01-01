import { CustomError } from './CustomError';

export class NotLikedError extends CustomError {
	constructor(message: string = 'Bad request') {
		super(422, message);
	}
}
