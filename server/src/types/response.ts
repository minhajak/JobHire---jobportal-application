export interface SuccessResponse {
	success: true;
	message: string;
	accessToken?: string;
	user?: {
		id: string;
		email: string;
	};
}

export interface ErrorResponse {
	success: false;
	message: string;
}

interface ValidationErrorResponse extends ErrorResponse {
	errors?: Array<string>;
}

export type SignUpResponseType =
	| SuccessResponse
	| ErrorResponse
	| ValidationErrorResponse;
