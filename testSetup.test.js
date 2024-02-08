/**
  The purpose of this file is to set up the environment for the tests.
  This file is automatically run before any test files are run.

  This file is named with a .test.js extention
  so that it is not included in the test coverage report.
  As of right now, bun does not support excluding files from the coverage report.
*/

process.env.NODE_ENV = "test";
/**
  this test database should not be used, but rather
  prefer to mock all database calls.

  It is only set in case of an oversight so we don't
  accidentally overwrite our development database
*/
process.env.DATABASE_URL =
  "postgres://postgres:@localhost:5432/application_tracking_test";

const { mock } = require("bun:test");

const mockPrisma = {};
/**
  Mock the Date object to always return the same date
  for idempotent tests. However, we can still pass in
  a date to the Date constructor and it will work as expected
*/
const CONSTANT_DATE = new Date("2024-02-08T00:00:00Z");

const OriginalDate = Date;

class MockDate extends OriginalDate {
  constructor(...args) {
    // If no arguments, use the constant date
    if (args.length === 0) {
      super(CONSTANT_DATE);
      return this;
    }
    // Otherwise, act as a normal Date object
    super(...args);
  }

  static now() {
    return CONSTANT_DATE.getTime();
  }
}

global.Date = MockDate;

mock.module("@/services/globalPrismaClient", () => {
  return { default: mockPrisma };
});

console.log("\nnew Date() has been froze at 2024-02-08T00:00:00Z");
console.log("The global Prisma client has been mocked.\n");
