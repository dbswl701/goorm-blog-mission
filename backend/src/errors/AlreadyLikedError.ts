import { CustomError } from './CustomError';

export class AlreadyLikedError extends CustomError {
	constructor(message: string = 'Bad request') {
		super(422, message);
	}
}
