import 'express-session';
import { UserInterface } from '../src/types';

declare module 'express-session' {
	interface SessionData {
		logined?: boolean;
		user?: UserInterface;
	}
}
