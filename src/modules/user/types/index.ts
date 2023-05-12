export type IUser = {
  id: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  email: string;
  phoneNumber: string;
  createdAt: string;
  iat: number;
  exp: number;
};

export interface IUserRequest {
  user: IUser;
}
