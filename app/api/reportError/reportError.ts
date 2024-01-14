import Bugsnag from "@bugsnag/js";

if (process.env.NODE_ENV !== "development") {
  Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY || "",
  });
}

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface ErrorObject {
  message: string;
  stack?: string;
  user?: User;
}

/**
 * Helper function to report events.
 *
 * @param errorObject - The error object containing message, stack, and user details.
 */
export const reportError = (errorObject: ErrorObject): void => {
  console.error(errorObject.message);
  if (process.env.NODE_ENV === "development") return;

  try {
    const defaultErrorMessage = "An unknown error occurred";
    const defaultErrorStack = "No stack trace available";

    if (errorObject.user) {
      const {
        id = "unknown",
        email = "unknown",
        firstName,
        lastName,
      } = errorObject.user;
      const userFullName =
        [firstName, lastName].filter(Boolean).join(" ") || "Anonymous User";

      Bugsnag.setUser(id, email, userFullName);
    }

    Bugsnag.notify(
      new Error(errorObject.message || defaultErrorMessage),
      (event) => {
        event.addMetadata("info", {
          message: errorObject.message || defaultErrorMessage,
          stack: errorObject.stack || defaultErrorStack,
          user: errorObject.user || "unknown",
        });
      }
    );
  } catch (error) {
    console.error("Failed to report to Bugsnag:", error);
    throw new Error("Failed to report error");
  }
};
