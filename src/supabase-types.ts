export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Playlists: {
        Row: {
          createdAt: string
          creatorID: string
          description: string | null
          id: string
          imageURL: string
          isPublic: boolean
          songs: string
          title: string
        }
        Insert: {
          createdAt?: string
          creatorID?: string
          description?: string | null
          id?: string
          imageURL?: string
          isPublic?: boolean
          songs?: string
          title: string
        }
        Update: {
          createdAt?: string
          creatorID?: string
          description?: string | null
          id?: string
          imageURL?: string
          isPublic?: boolean
          songs?: string
          title?: string
        }
        Relationships: []
      }
      PlaylistSongs: {
        Row: {
          dateAdded: string
          position: number
          songID: string
        }
        Insert: {
          dateAdded?: string
          position: number
          songID?: string
        }
        Update: {
          dateAdded?: string
          position?: number
          songID?: string
        }
        Relationships: [
          {
            foreignKeyName: "PlaylistSongs_songID_fkey"
            columns: ["songID"]
            isOneToOne: true
            referencedRelation: "Songs"
            referencedColumns: ["id"]
          },
        ]
      }
      Songs: {
        Row: {
          artist: string
          duration: string
          id: string
          imageURL: string
          title: string
          year: string
        }
        Insert: {
          artist: string
          duration: string
          id?: string
          imageURL: string
          title: string
          year: string
        }
        Update: {
          artist?: string
          duration?: string
          id?: string
          imageURL?: string
          title?: string
          year?: string
        }
        Relationships: []
      }
      UserInfo: {
        Row: {
          id: string
          imageURL: string
          username: string
        }
        Insert: {
          id?: string
          imageURL?: string
          username: string
        }
        Update: {
          id?: string
          imageURL?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserInfo_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
