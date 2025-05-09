import path from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';
import fsPromises from 'fs/promises';

const timeout = 5000
const pathToFile = 'path/to/file'
const testFileContent = 'It is a test file content'

beforeEach(() => {
  jest.clearAllMocks();
});

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeoutSpy = jest.spyOn(global, 'setTimeout');

    expect(timeoutSpy).toHaveBeenCalledTimes(0)
    expect(callback).toHaveBeenCalledTimes(0)

    doStuffByTimeout(callback, timeout)

    expect(timeoutSpy).toHaveBeenCalledTimes(1)
    expect(timeoutSpy).toHaveBeenLastCalledWith(callback, timeout)
    expect(callback).toHaveBeenCalledTimes(0)
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeoutSpy = jest.spyOn(global, 'setTimeout');

    expect(timeoutSpy).toHaveBeenCalledTimes(0)
    
    doStuffByTimeout(callback, timeout)

    expect(timeoutSpy).toHaveBeenCalledTimes(1)
    expect(timeoutSpy).toHaveBeenLastCalledWith(callback, timeout)
    expect(callback).toHaveBeenCalledTimes(0)
    
    jest.advanceTimersByTime(timeout)
    expect(callback).toHaveBeenCalledTimes(1)
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const intervalSpy = jest.spyOn(global, 'setInterval');

    expect(intervalSpy).toHaveBeenCalledTimes(0)
    
    doStuffByInterval(callback, timeout)

    expect(intervalSpy).toHaveBeenCalledTimes(1)
    expect(intervalSpy).toHaveBeenLastCalledWith(callback, timeout)
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeoutSpy = jest.spyOn(global, 'setInterval');

    expect(timeoutSpy).toHaveBeenCalledTimes(0)
    
    doStuffByInterval(callback, timeout)

    expect(timeoutSpy).toHaveBeenCalledTimes(1)
    expect(timeoutSpy).toHaveBeenLastCalledWith(callback, timeout)
    expect(callback).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(timeout)
    expect(callback).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(timeout)
    expect(callback).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(timeout)
    expect(callback).toHaveBeenCalledTimes(3)
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const mockedJoin = jest.spyOn(path, 'join')

    expect(mockedJoin).toHaveBeenCalledTimes(0)
    await readFileAsynchronously(pathToFile)

    expect(mockedJoin).toHaveBeenCalledTimes(1)
    expect(mockedJoin).toHaveBeenLastCalledWith(__dirname, pathToFile)
  });

  test('should return null if file does not exist', async () => {
    const mockedExistsSync = jest.spyOn(fs, 'existsSync')
    mockedExistsSync.mockReturnValue(false)

    expect(mockedExistsSync).toHaveBeenCalledTimes(0)
    const result = await readFileAsynchronously(pathToFile)

    expect(mockedExistsSync).toHaveBeenCalledTimes(1)
    expect(result).toBeNull()
  });

  test('should return file content if file exists', async () => {
    const mockedReadFile = jest.spyOn(fsPromises, 'readFile')
    const mockedExistsSync = jest.spyOn(fs, 'existsSync')

    mockedExistsSync.mockReturnValue(true)
    mockedReadFile.mockResolvedValue(testFileContent)

    expect(mockedReadFile).toHaveBeenCalledTimes(0)
    const result = await readFileAsynchronously(pathToFile)

    expect(mockedReadFile).toHaveBeenCalledTimes(1)
    expect(result).toEqual(testFileContent)
  });
});
