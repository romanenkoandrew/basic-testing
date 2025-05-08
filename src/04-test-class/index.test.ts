import lodash from "lodash";
import { getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';

const defaultBalance = 100
const gtDefaultBalance = 101
const balanceChangigValue = 50
const secondDefaultBalance = 1000

beforeEach(() => {
  jest.clearAllMocks();
});

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const instance = getBankAccount(defaultBalance)
    
    expect(instance.getBalance()).toEqual(defaultBalance)
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const instance = getBankAccount(defaultBalance)

    const spy = jest.spyOn(instance, 'withdraw')
    expect(() => instance.withdraw(gtDefaultBalance)).toThrow(InsufficientFundsError)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(gtDefaultBalance)
  });

  test('should throw error when transferring more than balance', () => {
    const instance = getBankAccount(defaultBalance)
    const instance2 = getBankAccount(secondDefaultBalance)
    const spy = jest.spyOn(instance, 'transfer')

    expect(() => instance.transfer(gtDefaultBalance, instance2)).toThrow(InsufficientFundsError)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(gtDefaultBalance, instance2)
  });

  test('should throw error when transferring to the same account', () => {
    const instance = getBankAccount(defaultBalance)
    const spy = jest.spyOn(instance, 'transfer')

    expect(() => instance.transfer(defaultBalance, instance)).toThrow(TransferFailedError)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(defaultBalance, instance)
  });

  test('should deposit money', () => {
    const instance = getBankAccount(defaultBalance)
    const spy = jest.spyOn(instance, 'deposit')
    
    instance.deposit(balanceChangigValue)
    
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(balanceChangigValue)
    expect(instance.getBalance()).toEqual(defaultBalance + balanceChangigValue)
  });

  test('should withdraw money', () => {
    const instance = getBankAccount(defaultBalance)

    const spy = jest.spyOn(instance, 'withdraw')
    
    instance.withdraw(balanceChangigValue)
    
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(balanceChangigValue)
    expect(instance.getBalance()).toEqual(defaultBalance - balanceChangigValue)
  });

  test('should transfer money', () => {
    const instance = getBankAccount(defaultBalance)
    const instance2 = getBankAccount(secondDefaultBalance)
    const spy = jest.spyOn(instance, 'transfer')

    instance.transfer(balanceChangigValue, instance2)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(balanceChangigValue, instance2)

    expect(instance.getBalance()).toEqual(defaultBalance - balanceChangigValue)
    expect(instance2.getBalance()).toEqual(secondDefaultBalance + balanceChangigValue)
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const instance = getBankAccount(defaultBalance)
    const spy = jest.spyOn(instance, 'fetchBalance')
    const mockedRandom = jest.spyOn(lodash, 'random')
   
    mockedRandom.mockReturnValue(balanceChangigValue)

    const result = await instance.fetchBalance()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(result).toEqual(balanceChangigValue)

    mockedRandom.mockReturnValue(0)

    const secondResult = await instance.fetchBalance()
    expect(spy).toHaveBeenCalledTimes(2)
    expect(secondResult).toEqual(null)
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const instance = getBankAccount(defaultBalance)
    const spy = jest.spyOn(instance, 'synchronizeBalance')
    const mockedRandom = jest.spyOn(lodash, 'random')
    const mockedfetchBalance = jest.spyOn(instance, 'fetchBalance')
    
    mockedRandom.mockReturnValue(balanceChangigValue)

    await instance.synchronizeBalance()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(mockedfetchBalance).toHaveBeenCalledTimes(1)
    expect(instance.getBalance()).toEqual(balanceChangigValue)
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const instance = getBankAccount(defaultBalance)
    const mockedRandom = jest.spyOn(lodash, 'random')
    mockedRandom.mockReturnValue(0)

    await expect(instance.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError)
  });
});
