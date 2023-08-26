import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user';
import { createUser } from './user';


jest.mock('../services/user');
const createUserMock = jest.mocked(userService.createUser, { shallow: false });
const loginUserMock = jest.mocked(userService.loginUser, { shallow: false });
const getUserDetailsMock = jest.mocked(userService.getUserDetails, { shallow: false });
const getUserListMock = jest.mocked(userService.getUserDetails, { shallow: false });

const mockResponse = {
  status: () => jest.fn().mockReturnValue(this),
  json: (body: any) => jest.fn().mockReturnValue(body),
  locals: {},
} as any as Response;

const mockRequest = {
  body: {},
  params: {},
  query: {},
} as any as Request;

const mockNext = jest.fn() as any as NextFunction;
beforeEach(() => {
  jest.clearAllMocks();
});

describe('createUser', () => {
  it('should throw an error if a field is missing from the body', async () => {
    await expect(createUser(mockRequest, mockResponse, mockNext)).resolves.toThrowError();
  })
})