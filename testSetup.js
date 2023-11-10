import resetDatabase from "./prisma/resetDatabase";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  "postgres://postgres:@localhost:5432/application_tracking_test";

try {
  await resetDatabase();
} catch {
  console.error("\nThere was an error resetting your test database");
  console.log(
    "Make sure you have first created a postgres database called 'application_tracking_test' \nand then run 'bun run migrate:test' to prepare the test database\n"
  );
  process.exit(1);
}
