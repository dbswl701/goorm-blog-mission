export interface CorsConfigInterface {
	origin: string;
	credentials: boolean;
}

export interface AuthInterface {
	username: string;
	password: string;
}

export interface UserInterface {
	id: string;
	username: string;
}

export interface PostInterface {
	id: string;
	title: string;
	author: string;
	contents: string;
}
