import httpStatus from 'http-status';
import * as postRepo from '../repositories/post';
import { addCommentToPost, createPost, getPostDetails, getPosts } from './post';
import { Op } from 'sequelize';


jest.mock('../repositories/post');

const findOnePostMock = jest.mocked(postRepo.findOnePostRepo,  { shallow: false });
const createPostMock = jest.mocked(postRepo.createPostRepo, { shallow: false });
const findAllPostMock = jest.mocked(postRepo.findAllPostsRepo, { shallow: false });
const createCommentMock = jest.mocked(postRepo.createCommentRepo, { shallow: false });

beforeEach(() => {
  jest.clearAllMocks();
});

const posts = [
  {
    'id': 1,
    'title': 'My First Post',
    'content': 'Content of my first post',
    'createdAt': '2023-08-25T16:45:54.723Z',
    'updatedAt': '2023-08-25T16:45:54.723Z',
    'user': {
      'user_id': '330caf08-1b8b-40a1-b1fc-3649640da624',
      'email': 'adex@gmail.com',
    },
  },
  {
    'id': 2,
    'title': 'My Second Post',
    'content': 'Content of my second post',
    'createdAt': '2023-08-25T16:48:29.765Z',
    'updatedAt': '2023-08-25T16:48:29.765Z',
    'user': {
      'user_id': '330caf08-1b8b-40a1-b1fc-3649640da624',
      'email': 'adex@gmail.com',
    },
  },
  {
    'id': 3,
    'title': 'My Second Post',
    'content': 'Content of my second post',
    'createdAt': '2023-08-25T16:52:57.590Z',
    'updatedAt': '2023-08-25T16:52:57.590Z',
    'user': {
      'user_id': '330caf08-1b8b-40a1-b1fc-3649640da624',
      'email': 'adex@gmail.com',
    },
  },
  {
    'id': 4,
    'title': 'My Second Post',
    'content': 'Content of my second post',
    'createdAt': '2023-08-25T16:55:14.493Z',
    'updatedAt': '2023-08-25T16:55:14.493Z',
    'user': {
      'user_id': '330caf08-1b8b-40a1-b1fc-3649640da624',
      'email': 'adex@gmail.com',
    },
  },
];

describe('tests for getPostDetails', () => {
  it('should throw an error if invalid post_id is passed', async () => {
    findOnePostMock.mockImplementationOnce(() => Promise.resolve(null));
    await expect(getPostDetails(2)).rejects.toEqual({
      code: httpStatus.BAD_REQUEST,
      message: 'No post found for post id',
    });
    expect(findOnePostMock).toHaveBeenCalledTimes(1);
    const called = findOnePostMock.mock.calls[0][0];
    expect(called).toMatchObject({
      where: {
        id: 2,
      },
    });
  });
});

describe('tests for createPost', () => {

  it('should call createPostRepo function', async () => {
    findOnePostMock.mockImplementationOnce(() => Promise.resolve(posts[0]));
    createPostMock.mockImplementation(() => Promise.resolve({ id: 2 }));
    await createPost({
      title: 'test title',
      content: 'test content',
    }, 3);
    expect(createPostMock).toHaveBeenCalledTimes(1);
    expect(createPostMock).toHaveBeenCalledWith({
      title: 'test title',
      content: 'test content',
      user_id: 3,
    });
    expect(findOnePostMock).toHaveBeenCalledTimes(1);
    const called = findOnePostMock.mock.calls[0][0];
    expect(called).toMatchObject({
      where: {
        id: 2,
      },
    });
  });
});

describe('tests for getPosts', () => {
  it('should call getPosts', async () => {
    findAllPostMock.mockImplementationOnce(() => Promise.resolve(posts));
    await getPosts({});
    expect(findAllPostMock).toHaveBeenCalledTimes(1);
  });

  it('should call findAllPostsRepo with correct where query', async () => {
    findAllPostMock.mockImplementationOnce(() => Promise.resolve(posts));
    await getPosts({
      dateFrom: new Date(),
      dateTo: new Date(),
    });
    expect(findAllPostMock).toHaveBeenCalledTimes(1);
    const called = findAllPostMock.mock.calls[0][0];
    expect(called).toMatchObject({
      where: {
        [Op.and]: [
          { createdAt: {} },
          { createdAt: {} },
        ],
      },
    });
  });
});

describe('tests for createComment', () => {

  it('should call createComment function', async () => {
    findOnePostMock.mockImplementationOnce(() => Promise.resolve(posts[0]));
    createCommentMock.mockImplementation(() => Promise.resolve());
    await addCommentToPost(
      { comment: 'my comment' },
      3,
      5,
    );
    expect(createCommentMock).toHaveBeenCalledTimes(1);
    expect(createCommentMock).toHaveBeenCalledWith({
      comment: 'my comment',
      post_id: 3,
      user_id: 5,
    });
    expect(findOnePostMock).toHaveBeenCalledTimes(1);
    const called = findOnePostMock.mock.calls[0][0];
    expect(called).toMatchObject({
      where: {
        id: 3,
      },
    });
  });
});