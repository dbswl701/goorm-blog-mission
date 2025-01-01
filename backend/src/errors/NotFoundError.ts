import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
	constructor(message: string = 'Bad request') {
		super(404, message);
	}
}
