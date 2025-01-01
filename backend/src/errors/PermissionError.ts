import { CustomError } from './CustomError';

export class PermissionError extends CustomError {
	constructor(message: string = 'PermissionError') {
		super(403, message);
	}
}
