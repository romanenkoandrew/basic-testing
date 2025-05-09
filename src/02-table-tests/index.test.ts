import {  simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 2, action: Action.Subtract, expected: 0 },
    { a: 3, b: 2, action: Action.Multiply, expected: 6 },
    { a: 10, b: 2, action: Action.Divide, expected: 5 },
    { a: 10, b: 2, action: Action.Exponentiate, expected: 100 },
    { a: 10, b: 2, action: null, expected: null },
    { a: 10, b: '2', action: Action.Exponentiate, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)('Test action %#: (%s)', ({a, b, action, expected}) => {
    expect(simpleCalculator({a, b, action})).toEqual(expected)
  })
});
