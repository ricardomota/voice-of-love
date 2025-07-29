export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      conversation_analytics: {
        Row: {
          conversation_date: string
          created_at: string
          id: string
          key_moments: string[] | null
          person_id: string
          personality_adaptations: Json | null
          relationship_dynamics: Json | null
          sentiment_analysis: Json | null
          topics_discussed: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_date?: string
          created_at?: string
          id?: string
          key_moments?: string[] | null
          person_id: string
          personality_adaptations?: Json | null
          relationship_dynamics?: Json | null
          sentiment_analysis?: Json | null
          topics_discussed?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_date?: string
          created_at?: string
          id?: string
          key_moments?: string[] | null
          person_id?: string
          personality_adaptations?: Json | null
          relationship_dynamics?: Json | null
          sentiment_analysis?: Json | null
          topics_discussed?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          person_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          person_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          person_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      dynamic_memories: {
        Row: {
          auto_generated: boolean | null
          confirmed_by_user: boolean | null
          context_tags: string[] | null
          created_at: string
          expires_at: string | null
          id: string
          importance_score: number | null
          memory_text: string
          memory_type: string
          person_id: string
          source_conversation_id: string | null
        }
        Insert: {
          auto_generated?: boolean | null
          confirmed_by_user?: boolean | null
          context_tags?: string[] | null
          created_at?: string
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          memory_text: string
          memory_type: string
          person_id: string
          source_conversation_id?: string | null
        }
        Update: {
          auto_generated?: boolean | null
          confirmed_by_user?: boolean | null
          context_tags?: string[] | null
          created_at?: string
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          memory_text?: string
          memory_type?: string
          person_id?: string
          source_conversation_id?: string | null
        }
        Relationships: []
      }
      memories: {
        Row: {
          created_at: string
          file_name: string | null
          id: string
          media_type: string | null
          media_url: string | null
          person_id: string
          text: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          person_id: string
          text: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          person_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          audio_url: string | null
          content: string
          conversation_id: string
          created_at: string
          has_audio: boolean | null
          id: string
          is_user: boolean
        }
        Insert: {
          audio_url?: string | null
          content: string
          conversation_id: string
          created_at?: string
          has_audio?: boolean | null
          id?: string
          is_user?: boolean
        }
        Update: {
          audio_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          has_audio?: boolean | null
          id?: string
          is_user?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          avatar: string | null
          birth_year: number | null
          common_phrases: string[] | null
          created_at: string
          emotional_tone: string | null
          humor_style: string | null
          id: string
          last_conversation: string | null
          name: string
          personality: string[] | null
          relationship: string
          talking_style: string | null
          temperature: number | null
          topics: string[] | null
          updated_at: string
          user_id: string | null
          values: string[] | null
          verbosity: string | null
          voice_settings: Json | null
        }
        Insert: {
          avatar?: string | null
          birth_year?: number | null
          common_phrases?: string[] | null
          created_at?: string
          emotional_tone?: string | null
          humor_style?: string | null
          id?: string
          last_conversation?: string | null
          name: string
          personality?: string[] | null
          relationship: string
          talking_style?: string | null
          temperature?: number | null
          topics?: string[] | null
          updated_at?: string
          user_id?: string | null
          values?: string[] | null
          verbosity?: string | null
          voice_settings?: Json | null
        }
        Update: {
          avatar?: string | null
          birth_year?: number | null
          common_phrases?: string[] | null
          created_at?: string
          emotional_tone?: string | null
          humor_style?: string | null
          id?: string
          last_conversation?: string | null
          name?: string
          personality?: string[] | null
          relationship?: string
          talking_style?: string | null
          temperature?: number | null
          topics?: string[] | null
          updated_at?: string
          user_id?: string | null
          values?: string[] | null
          verbosity?: string | null
          voice_settings?: Json | null
        }
        Relationships: []
      }
      personality_evolution: {
        Row: {
          applied: boolean | null
          confidence_score: number | null
          created_at: string
          evolution_date: string
          evolution_reason: string | null
          id: string
          new_traits: Json | null
          person_id: string
          previous_traits: Json | null
        }
        Insert: {
          applied?: boolean | null
          confidence_score?: number | null
          created_at?: string
          evolution_date?: string
          evolution_reason?: string | null
          id?: string
          new_traits?: Json | null
          person_id: string
          previous_traits?: Json | null
        }
        Update: {
          applied?: boolean | null
          confidence_score?: number | null
          created_at?: string
          evolution_date?: string
          evolution_reason?: string | null
          id?: string
          new_traits?: Json | null
          person_id?: string
          previous_traits?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      schedule_memory_cleanup: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
