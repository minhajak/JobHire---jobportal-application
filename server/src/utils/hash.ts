import bcrypt from "bcrypt";
export const hashPassword = async (password: string) =>
	await bcrypt.hash(password, 10);

export const compareHashedPassword = async (
	password: string,
	hashedPassword: string,
) => {
	return await bcrypt.compare(password, hashedPassword);
};
