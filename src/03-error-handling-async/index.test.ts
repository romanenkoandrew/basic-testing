import { resolveValue, throwError, throwCustomError, MyAwesomeError, rejectCustomError } from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    expect.assertions(1);
    const value = 'testValue'
    expect(await resolveValue(value)).toEqual(value)
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
      const message = 'Something went wrong'
      expect(() => throwError(message)).toThrow(message)
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!')
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(new MyAwesomeError())
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect.assertions(1)
    await expect(rejectCustomError).rejects.toEqual(new MyAwesomeError())
  });
});
