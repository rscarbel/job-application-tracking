export interface OAuthAccount {
  providerAccountId: string;
  provider: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  oAuth: OAuthAccount[];
}

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface Token {
  uid: number;
  provider: string;
}
