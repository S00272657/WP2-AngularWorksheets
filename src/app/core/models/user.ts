export interface User {
  _id?: string;
  name: string;
  email: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}
