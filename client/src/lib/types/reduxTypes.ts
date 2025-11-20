export type User = {
  id?: string;
  username?: string;
  email: string;
  role?:string
};

export type AuthState = {

  accessToken: string | null;
};