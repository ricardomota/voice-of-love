export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      audio_files: {
        Row: {
          created_at: string
          duration: number | null
          file_name: string
          file_url: string
          id: string
          person_id: string
          transcription: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          file_name: string
          file_url: string
          id?: string
          person_id: string
          transcription?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          file_name?: string
          file_url?: string
          id?: string
          person_id?: string
          transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_files_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      beta_access: {
        Row: {
          access_code: string
          created_at: string
          email: string
          id: string
          used_at: string | null
        }
        Insert: {
          access_code?: string
          created_at?: string
          email: string
          id?: string
          used_at?: string | null
        }
        Update: {
          access_code?: string
          created_at?: string
          email?: string
          id?: string
          used_at?: string | null
        }
        Relationships: []
      }
      capacity: {
        Row: {
          active_slots: number
          buffer_slots: number
          id: number
          max_slots: number
          plan_name: string
          updated_at: string
        }
        Insert: {
          active_slots?: number
          buffer_slots?: number
          id?: number
          max_slots?: number
          plan_name?: string
          updated_at?: string
        }
        Update: {
          active_slots?: number
          buffer_slots?: number
          id?: number
          max_slots?: number
          plan_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      config: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
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
      cost_inputs: {
        Row: {
          created_at: string
          elevenlabs_per_min: number | null
          hosting_per_user_month: number | null
          id: string
          openai_per_1k_tokens: number | null
          target_margin_pct: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          elevenlabs_per_min?: number | null
          hosting_per_user_month?: number | null
          id?: string
          openai_per_1k_tokens?: number | null
          target_margin_pct?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          elevenlabs_per_min?: number | null
          hosting_per_user_month?: number | null
          id?: string
          openai_per_1k_tokens?: number | null
          target_margin_pct?: number
          updated_at?: string
        }
        Relationships: []
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
          birth_date: string | null
          birth_year: number | null
          common_phrases: string[] | null
          created_at: string
          emotional_tone: string | null
          how_they_called_you: string | null
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
          birth_date?: string | null
          birth_year?: number | null
          common_phrases?: string[] | null
          created_at?: string
          emotional_tone?: string | null
          how_they_called_you?: string | null
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
          birth_date?: string | null
          birth_year?: number | null
          common_phrases?: string[] | null
          created_at?: string
          emotional_tone?: string | null
          how_they_called_you?: string | null
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
      plans: {
        Row: {
          created_at: string
          limits: Json | null
          monthly_price_brl: number | null
          monthly_price_usd: number | null
          plan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          limits?: Json | null
          monthly_price_brl?: number | null
          monthly_price_usd?: number | null
          plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          limits?: Json | null
          monthly_price_brl?: number | null
          monthly_price_usd?: number | null
          plan_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email_verified: boolean | null
          entitlements: Json | null
          id: string
          plan: string | null
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_verified?: boolean | null
          entitlements?: Json | null
          id?: string
          plan?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_verified?: boolean | null
          entitlements?: Json | null
          id?: string
          plan?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      usage_counters: {
        Row: {
          chat_interactions_used: number | null
          created_at: string
          free_demo_seconds_used: number | null
          messages_used: number
          period: string
          tts_seconds_used: number
          updated_at: string
          user_id: string
          voice_seconds_used: number | null
        }
        Insert: {
          chat_interactions_used?: number | null
          created_at?: string
          free_demo_seconds_used?: number | null
          messages_used?: number
          period: string
          tts_seconds_used?: number
          updated_at?: string
          user_id: string
          voice_seconds_used?: number | null
        }
        Update: {
          chat_interactions_used?: number | null
          created_at?: string
          free_demo_seconds_used?: number | null
          messages_used?: number
          period?: string
          tts_seconds_used?: number
          updated_at?: string
          user_id?: string
          voice_seconds_used?: number | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          param_overrides: Json | null
          plan_id: string
          preferred_base_voice_id: string | null
          ui_language: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          param_overrides?: Json | null
          plan_id?: string
          preferred_base_voice_id?: string | null
          ui_language?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          param_overrides?: Json | null
          plan_id?: string
          preferred_base_voice_id?: string | null
          ui_language?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_preferred_base_voice_id_fkey"
            columns: ["preferred_base_voice_id"]
            isOneToOne: false
            referencedRelation: "voices_base"
            referencedColumns: ["id"]
          },
        ]
      }
      user_voice_assets: {
        Row: {
          created_at: string
          id: string
          lang: string | null
          provider_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lang?: string | null
          provider_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lang?: string | null
          provider_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_clone_waitlist: {
        Row: {
          created_at: string
          id: string
          language: string
          notified_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          language: string
          notified_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          notified_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      voices: {
        Row: {
          created_at: string
          eleven_voice_id: string | null
          id: string
          last_used_at: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          eleven_voice_id?: string | null
          id?: string
          last_used_at?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          eleven_voice_id?: string | null
          id?: string
          last_used_at?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voices_base: {
        Row: {
          created_at: string
          default_params: Json | null
          gender: string | null
          id: string
          lang_supported: string[] | null
          provider: string
          style_tags: string[] | null
          updated_at: string
          voice_key: string
        }
        Insert: {
          created_at?: string
          default_params?: Json | null
          gender?: string | null
          id?: string
          lang_supported?: string[] | null
          provider: string
          style_tags?: string[] | null
          updated_at?: string
          voice_key: string
        }
        Update: {
          created_at?: string
          default_params?: Json | null
          gender?: string | null
          id?: string
          lang_supported?: string[] | null
          provider?: string
          style_tags?: string[] | null
          updated_at?: string
          voice_key?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          full_name: string
          how_did_you_hear: string | null
          id: string
          message: string | null
          primary_interest: string | null
          processed_at: string | null
          requested_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          how_did_you_hear?: string | null
          id?: string
          message?: string | null
          primary_interest?: string | null
          processed_at?: string | null
          requested_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          how_did_you_hear?: string | null
          id?: string
          message?: string | null
          primary_interest?: string | null
          processed_at?: string | null
          requested_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      compute_entitlements: {
        Args: { user_plan: string }
        Returns: Json
      }
      ensure_usage_row: {
        Args: { p_period: string; p_user_id: string }
        Returns: undefined
      }
      get_user_subscription_info: {
        Args: { user_id: string }
        Returns: Json
      }
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
