import IUser from "../database-types/IUser";
import { UserID, generate_id } from "../database-types/ID";

export function createUser(username: string, email: string, password: string, imageURL: string): IUser {
  if (!username || username.length > 16) {
    throw new Error('Invalid username. Must be 16 characters or less.');
  } else if (!email || email.length > 150) {
    throw new Error('Invalid email. Must be 150 characters or less.');
  } else if (!password) {
    throw new Error('A password must be provided');
  }

  const id = generate_id() as UserID;
  // db.run(`INSERT INTO Users (id, username, email, password, imageURL) VALUES (?, ?, ?, ?, ?)`, id, username, email, password, imageURL, (err: any) => {
  //   if (err) {
  //     console.error('Error inserting user:', err.message);
  //   }
  // });

  return {
    id,
    username,
    email,
    password,
    imageURL
  } as IUser;
}

// TODO: more database functions here