export const generateOtp = (length: number = 6): string => {
	return Math.floor(10 ** length + Math.random() * 9 * 10 ** length).toString();
};
