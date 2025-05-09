import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  const original = jest.requireActual('lodash')
  return {
    ...original,
    throttle: (fn: any) => fn,
  };
});

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  afterEach(() => {
    jest.clearAllMocks()
  });

  test('should create instance with provided base url', async () => {
    const mockGet = jest.fn()
    const mockCreate = jest.fn().mockReturnValue({ get: mockGet })
    mockGet.mockResolvedValueOnce({ data: {} })
    mockedAxios.create = mockCreate

    expect(mockCreate).toHaveBeenCalledTimes(0)
    
    await throttledGetDataFromApi('/users')
    
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    })
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn()
    const mockCreate = jest.fn().mockReturnValue({ get: mockGet })
    mockGet.mockResolvedValueOnce({ data: {} })
    mockedAxios.create = mockCreate

    expect(mockGet).toHaveBeenCalledTimes(0)
    
    await throttledGetDataFromApi('/users')

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenLastCalledWith('/users')
  });

  test('should return response data', async () => {
    const mockGet = jest.fn()
    const mockCreate = jest.fn().mockReturnValue({ get: mockGet })
    const mockResponse = { data: { id: 1, username: 'test Username' } };
    mockGet.mockResolvedValueOnce({ data: mockResponse })
    mockedAxios.create = mockCreate

    const result = await throttledGetDataFromApi('/users');

    expect(result).toEqual(mockResponse)
  });
});
