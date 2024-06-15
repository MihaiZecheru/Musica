declare const __brand: unique symbol
type Brand<B> = { [__brand]: B };
type Branded<T, B> = T & Brand<B>;

// ----------------------------------------

export type ID = Branded<string, "ID">; // 6 chars (alphanum hex)
export type UserID = Branded<ID, "UserID">;
export type SongID = Branded<ID, "SongID">;
export type PlaylistID = Branded<ID, "PlaylistID">;

export function generate_id(): ID {
  return Math.random().toString(36).substring(2, 8) as ID;
}