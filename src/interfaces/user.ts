export interface CreateUserInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UserInterface {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type LoginUserType = Pick<CreateUserInterface, 'email' | 'password'>;

export type GetUsersListInterface = {
  user_id?: string;
  email?: string;
  active?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
};