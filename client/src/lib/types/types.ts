export type IUser = {
  username?: string;
  email: string;
  password: string;
  newPassword?: string;
};

export type LoadingProps = {
  loading: boolean;
  message?: string;
};

