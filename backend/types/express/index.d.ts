import { UserInterface } from '../../src/types';

declare global {
	namespace Express {
		interface Request {
			defaultErrorMessage: string;
		}
	}
}
