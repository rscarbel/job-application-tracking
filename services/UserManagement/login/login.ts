import { findUserByEmail } from "..";
import { OAuthAccount, User } from "./interfaces";
import { ensureOauthLinked } from "./ensureOauthLinked";
import { createNewUserAndOauth } from "./createNewUserAndOauth";

/**
 * @description given user information and oauth account details, ensures the user is syned with the database.
 * @returns true if the user is successfully synced, false if there was an error.
 */
export const login = async ({
  user,
  account,
}: {
  user: User;
  account: OAuthAccount;
}) => {
  const email = user.email;

  if (!email) return false;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      ensureOauthLinked(existingUser, account);
      return true;
    } else {
      createNewUserAndOauth(email, user, account);
    }
  } catch (error) {
    reportError(error);
    console.error("Sign in error:", error);
    return false;
  }
  return true;
};
