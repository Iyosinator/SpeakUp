export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          author_name: string;
          content: string;
          created_at: string;
          id: string;
          post_id: string;
          session_id: string;
        };
        Insert: {
          author_name: string;
          content: string;
          created_at?: string;
          id?: string;
          post_id: string;
          session_id: string;
        };
        Update: {
          author_name?: string;
          content?: string;
          created_at?: string;
          id?: string;
          post_id?: string;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
      community_stats: {
        Row: {
          id: number;
          label: string;
          value: string;
        };
        Insert: {
          id?: number;
          label: string;
          value: string;
        };
        Update: {
          id?: number;
          label?: string;
          value?: string;
        };
        Relationships: [];
      };
      post_likes: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          session_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          session_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          author_name: string;
          comments_count: number;
          content: string;
          created_at: string;
          id: string;
          likes: number;
          session_id: string;
          tag: string;
          title: string;
        };
        Insert: {
          author_name: string;
          comments_count?: number;
          content: string;
          created_at?: string;
          id?: string;
          likes?: number;
          session_id: string;
          tag: string;
          title: string;
        };
        Update: {
          author_name?: string;
          comments_count?: number;
          content?: string;
          created_at?: string;
          id?: string;
          likes?: number;
          session_id?: string;
          tag?: string;
          title?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          additional_info: string | null;
          created_at: string;
          id: string;
          post_id: string;
          reason_id: string;
          status: "pending" | "resolved";
        };
        Insert: {
          additional_info?: string | null;
          created_at?: string;
          id?: string;
          post_id: string;
          reason_id: string;
          status?: "pending" | "resolved";
        };
        Update: {
          additional_info?: string | null;
          created_at?: string;
          id?: string;
          post_id?: string;
          reason_id?: string;
          status?: "pending" | "resolved";
        };
        Relationships: [
          {
            foreignKeyName: "reports_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_post_as_moderator: {
        Args: {
          p_post_id: string;
        };
        Returns: undefined;
      };
      toggle_like: {
        Args: {
          p_post_id: string;
          p_session_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
