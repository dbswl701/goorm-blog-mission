import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';

interface ErrorResponse {
	success: boolean;
	message: string;
}

export const errorHandler = (
	err: Error | CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let statusCode = 500;
	let message = req.defaultErrorMessage;

	if (err instanceof CustomError) {
		statusCode = err.statusCode;
		message = err.message;
	}

	const response: ErrorResponse = {
		success: false,
		message,
	};

	res.status(statusCode).json(response);
};
