import { expect, mock } from "bun:test";
import { inspect } from "util";

const deepEqual = (a: any, b: any) => {
  try {
    expect(a).toEqual(b);
    return true;
  } catch {
    return false;
  }
};

export const expectToHaveBeenCalledWith = (
  mockFunction: typeof mock.prototype,
  expectedCalls: any
) => {
  const isArrayOfCalls = Array.isArray(expectedCalls);
  const calls = mockFunction.mock.calls[0];
  const actualCalls = isArrayOfCalls ? calls : calls[0];

  let isMatch = false;

  if (Array.isArray(expectedCalls)) {
    for (const call of calls) {
      if (deepEqual(call, expectedCalls)) {
        isMatch = true;
        break;
      }
    }
  } else {
    isMatch = deepEqual(calls[0], expectedCalls);
  }

  if (!isMatch) {
    console.log(
      `\nExpected mock to be called with: ${inspect(expectedCalls, {
        depth: null,
        colors: true,
      })}\n\nActual calls: ${inspect(actualCalls, {
        depth: null,
        colors: true,
      })}\n`
    );
  }

  /**
   Expected and Actual mismatch
  */

  expect(mockFunction).toHaveBeenCalledWith(expectedCalls);
};
