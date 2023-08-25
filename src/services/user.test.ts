import httpStatus from 'http-status';
import { CreateUserInterface, LoginUserType, UserInterface } from '../interfaces/user';
import * as userRepo from '../repositories/user';
import { createUser, getUserDetails, getUsersList, loginUser } from './user';
import * as utils from '../utils';
import { Op } from 'sequelize';

jest.mock('../repositories/user');

const findOneUserMock = jest.mocked(userRepo.findOneUserRepo, { shallow: false });
const createUserMock = jest.mocked(userRepo.createUserRepo, { shallow: false });
const findAllUsersMock = jest.mocked(userRepo.findAllUsersRepo, { shallow: false });

const users: UserInterface[] = [
  {
    id: 1,
    user_id: '773e167b-7176-4fde-a8d3-d51758e5636c',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john-doe@email.com',
    active: true,
    password: '$2a$10$JjO6m7p5mIoYrljZTpwxxe7j2hmxL2n/Bwy2lbYehhpsiUyxkWtaW',
  },
  {
    id: 2,
    user_id: 'ac67026f-ca66-4641-a19a-00efed0102eb',
    first_name: 'bob',
    last_name: 'marley',
    email: 'bobMarley@email.com',
    active: true,
    password: '$2a$10$JjO6m7p5mIoYrljZTpwxxe7j2hmxL2n/Bwy2lbYehhpsiUyxkWtaW',
  },
  {
    id: 3,
    user_id: 'ac67026f-ca66-4641-a19a-00efed0102eb',
    first_name: 'Lionel',
    last_name: 'Messi',
    email: 'lionelMe@email.com',
    active: true,
    password: '$2a$10$JjO6m7p5mIoYrljZTpwxxe7j2hmxL2n/Bwy2lbYehhpsiUyxkWtaW',
  },
  {
    id: 4,
    user_id: '71415c6f-4f68-41f9-b148-84f85f8cd27f',
    first_name: 'asisat',
    last_name: 'oshoala',
    email: 'asisat@email.com',
    active: true,
    password: '$2a$10$JjO6m7p5mIoYrljZTpwxxe7j2hmxL2n/Bwy2lbYehhpsiUyxkWtaW',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('tests for create account', () => {
  const createUserData: CreateUserInterface = {
    first_name: 'bray',
    last_name: 'Wyatt',
    email: 'brayWyatt@email.com',
    password: 'password123',
  };

  it('should throw an error if email is in use', async () => {
    findOneUserMock.mockImplementationOnce(() => Promise.resolve(users[0]));
    await expect(createUser(createUserData)).rejects.toEqual({
      code: httpStatus.BAD_REQUEST,
      message: 'Please use another email, email already in use',
    });
  });

  it('should call the create user repo with an hashed password and user_id', async () => {
    findOneUserMock.mockImplementationOnce(() => Promise.resolve(null));
    createUserMock.mockImplementationOnce(() => Promise.resolve());
    await createUser(createUserData);
    expect(createUserMock).toHaveBeenCalledTimes(1);
    const called = createUserMock.mock.calls[0][0];
    expect(called.user_id).not.toBeNull();
    expect(called.password).not.toEqual(createUserData.password);
    const valid = await utils.comparePassword(createUserData.password, called.password);
    expect(valid).toBeTruthy();
  });

  it('should matchObject', async () => {
    findOneUserMock.mockImplementationOnce(() => Promise.resolve(null));
    createUserMock.mockImplementationOnce(() => Promise.resolve());
    jest.spyOn(utils, 'generateUserId').mockImplementationOnce(() => 'user_id');
    jest.spyOn(utils, 'generateJWTToken').mockImplementationOnce(() => 'access_token');


    const response = await createUser(createUserData);
    expect(response).toMatchObject({
      access_token: 'access_token',
      user: {
        email: 'brayWyatt@email.com',
        last_name: 'Wyatt',
        first_name: 'bray',
        user_id: 'user_id',
      },
    });
  });
});

describe('tests for login', () => {
  const loginUserData: LoginUserType = {
    email: 'brayWyatt@email.com',
    password: 'password123',
  };

  it('should throw an error if account is not found', async () => {
    findOneUserMock.mockImplementationOnce(() => Promise.resolve(null));
    await expect(loginUser(loginUserData)).rejects.toEqual({
      code: httpStatus.BAD_REQUEST,
      message: 'Email or Password Invalid',
    });
  });

  it('should throw an error if password is invalid', async () => {
    findOneUserMock.mockImplementationOnce(() => Promise.resolve(users[0]));
    jest.spyOn(utils, 'comparePassword').mockImplementationOnce(() => Promise.resolve(false));
    await expect(loginUser(loginUserData)).rejects.toEqual({
      code: httpStatus.BAD_REQUEST,
      message: 'Email or Password Invalid',
    });
  });

  it('should match response object', async () => {
    findOneUserMock.mockImplementationOnce(() => Promise.resolve(users[0]));
    jest.spyOn(utils, 'comparePassword').mockImplementationOnce(() => Promise.resolve(true));
    jest.spyOn(utils, 'generateJWTToken').mockImplementationOnce(() => 'access_token');
    const response = await loginUser(loginUserData);
    expect(response).toMatchObject({
      access_token: 'access_token',
      user: {
        email: users[0].email,
        last_name: users[0].last_name,
        first_name: users[0].first_name,
        user_id: users[0].user_id,
      },
    });
  });
});

describe('tests for get user details', () => {
  it('should throw an error if user is not found', async () => {
    findOneUserMock.mockImplementationOnce(() => Promise.resolve(null));
    await expect(getUserDetails('user_id')).rejects.toEqual({
      code: httpStatus.BAD_REQUEST,
      message: 'Invalid user id',
    });
    expect(findOneUserMock).toHaveBeenCalledTimes(1);
  });
});

describe('tests for get user list', () => {
  it('should call the findAllUsers repo function', async () => {
    findAllUsersMock.mockImplementationOnce(() => Promise.resolve(users));
    await getUsersList({});
    expect(findAllUsersMock).toHaveBeenCalledTimes(1);
  });

  it('should call findAllUsers with correct where query', async () => {
    findAllUsersMock.mockImplementationOnce(() => Promise.resolve(users));
    await getUsersList({
      user_id: 'user_id',
      email: 'email',
      active: false,
    });
    const called = findAllUsersMock.mock.calls[0][0];
    expect(called).toMatchObject({
      [Op.and]: [
        { user_id: 'user_id' },
        { email: 'email' },
        { active: false },
      ],
    });
  });
});