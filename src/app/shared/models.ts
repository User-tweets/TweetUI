export interface User {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
}

export interface TweetComment {
  username: string;
  comment: string;
}

export interface Tweet {
  tweetId: string;
  username: string;
  message: string;
  time: string;
  likes?: string[];
  comments?: TweetComment[];
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: unknown;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  contactNumber: string;
}
