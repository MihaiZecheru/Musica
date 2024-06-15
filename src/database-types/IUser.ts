import { UserID } from './ID';

export default interface IUser {
  id: UserID; // 6 chars (alphanum hex)
  username: string; // 16 chars max
  email: string; // 150 chars max
  password: string; // TEXT
  imageURL: string; // TEXT
}