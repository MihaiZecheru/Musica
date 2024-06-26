import { User } from "@supabase/supabase-js";
import supabase from "../config/supabase";

export default async function GetUser(): Promise<User> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error retrieving user: ', error);
    throw error;
  }

  return data.user;
}