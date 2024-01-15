import Bugsnag from "@bugsnag/js";
import { User } from "@prisma/client";

interface ReportErrorObjectInterface {
  message: string;
  stack: string;
}

const MISSING_ERROR_MESSAGE = "An unknown error occurred";
const MISSING_ERROR_STACK = "No stack trace available";
const MISSING_USER = {
  id: "unknown",
  email: "unknown",
  firstName: "unknown",
  lastName: "unknown",
};

if (process.env.NODE_ENV !== "development") {
  Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY || "",
  });
}

/**
 * Helper function to report events.
 *
 * @param errorObject - The error object containing message, stack, and user details.
 */
export const reportError = (
  error: ReportErrorObjectInterface,
  user: User | null
): void => {
  console.error(error.message);
  if (process.env.NODE_ENV === "development") return;

  const userWithErrors = user || MISSING_USER;
  const { id, email, firstName, lastName } = userWithErrors;

  try {
    Bugsnag.setUser(id, email, `${firstName} ${lastName}`);

    Bugsnag.notify(new Error(error?.message), (event) => {
      event.addMetadata("info", {
        message: error.message || MISSING_ERROR_MESSAGE,
        stack: error.stack || MISSING_ERROR_STACK,
        user: userWithErrors,
      });
    });
  } catch (error) {
    console.error("Failed to report to Bugsnag:", error);
    throw new Error("Failed to report error");
  }
};
