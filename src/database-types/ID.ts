declare const __brand: unique symbol
type Brand<B> = { [__brand]: B };
type Branded<T, B> = T & Brand<B>;

// ----------------------------------------

export type ID = Branded<`${string}-${string}-${string}-${string}`, "ID">; // UUID
export type UserID = Branded<ID, "UserID">;
export type SongID = Branded<ID, "SongID">;
export type SpotifySongID = Branded<string, "SpotifySongID">;
export type PlaylistID = Branded<ID, "PlaylistID">;
export function generate_id(): ID {
  return Math.random().toString(36).substring(2, 8) as ID;
}

// Youtube Video ID
export type VideoID = Branded<string, "VideoID">;