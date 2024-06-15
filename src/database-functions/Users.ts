import IUser from "../database-types/IUser";

export function createUser(username: string, email: string, password: string): IUser {
  if (!username || username.length > 16) {
    throw new Error('Invalid username. Must be 16 characters or less.');
  } else if (!email || email.length > 150) {
    throw new Error('Invalid email. Must be 150 characters or less.');
  } else if (!password) {
    throw new Error('A password must be provided');
  }

  // TODO: add to database here

  return {
    username,
    email,
    password
  } as IUser;
}

// TODO: more database functions here