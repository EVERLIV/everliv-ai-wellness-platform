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
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string
          id: string
          thumbnail: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          thumbnail: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          thumbnail?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      feature_trials: {
        Row: {
          feature_name: string
          id: string
          used_at: string
          user_id: string
        }
        Insert: {
          feature_name: string
          id?: string
          used_at?: string
          user_id: string
        }
        Update: {
          feature_name?: string
          id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      page_contents: {
        Row: {
          content: Json
          created_at: string
          id: string
          page_id: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          page_id: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          page_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_contents_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_sessions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_url: string
          plan_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id: string
          metadata?: Json | null
          payment_url: string
          plan_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_url?: string
          plan_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          allergies: string[] | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          goals: string[] | null
          height: number | null
          id: string
          last_name: string | null
          medical_conditions: string[] | null
          medications: string[] | null
          role: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          goals?: string[] | null
          height?: number | null
          id: string
          last_name?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          role?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          goals?: string[] | null
          height?: number | null
          id?: string
          last_name?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          role?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      promo_code_uses: {
        Row: {
          discounted_amount: number
          id: string
          original_amount: number
          plan_type: string
          promo_code_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          discounted_amount: number
          id?: string
          original_amount: number
          plan_type: string
          promo_code_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          discounted_amount?: number
          id?: string
          original_amount?: number
          plan_type?: string
          promo_code_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_uses_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_percent: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          one_time_per_user: boolean
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_percent: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          one_time_per_user?: boolean
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_percent?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          one_time_per_user?: boolean
          uses_count?: number
        }
        Relationships: []
      }
      protocol_analysis_results: {
        Row: {
          analysis_date: string
          created_at: string
          file_path: string | null
          id: string
          notes: string | null
          protocol_id: string
          title: string
          user_id: string
        }
        Insert: {
          analysis_date: string
          created_at?: string
          file_path?: string | null
          id?: string
          notes?: string | null
          protocol_id: string
          title: string
          user_id: string
        }
        Update: {
          analysis_date?: string
          created_at?: string
          file_path?: string | null
          id?: string
          notes?: string | null
          protocol_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_analysis_results_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "user_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      protocol_events: {
        Row: {
          completed: boolean
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          protocol_id: string
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          protocol_id: string
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          protocol_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_events_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "user_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      protocol_supplements: {
        Row: {
          created_at: string
          day: number
          dose: string
          id: string
          protocol_id: string
          scheduled_time: string | null
          supplement_name: string
          taken: boolean
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          day: number
          dose: string
          id?: string
          protocol_id: string
          scheduled_time?: string | null
          supplement_name: string
          taken?: boolean
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          day?: number
          dose?: string
          id?: string
          protocol_id?: string
          scheduled_time?: string | null
          supplement_name?: string
          taken?: boolean
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_supplements_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "user_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      protocol_wellbeing: {
        Row: {
          created_at: string
          day: number
          energy_level: number
          id: string
          notes: string | null
          protocol_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day: number
          energy_level: number
          id?: string
          notes?: string | null
          protocol_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          day?: number
          energy_level?: number
          id?: string
          notes?: string | null
          protocol_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_wellbeing_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "user_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string
          features: Json
          id: string
          is_active: boolean
          is_popular: boolean
          name: string
          price: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name: string
          price: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name?: string
          price?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          payment_id: string | null
          plan_type: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          payment_id?: string | null
          plan_type: string
          started_at?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          payment_id?: string | null
          plan_type?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_protocols: {
        Row: {
          added_at: string
          benefits: string[]
          category: string
          completed_at: string | null
          completion_percentage: number
          description: string
          difficulty: string
          duration: string
          id: string
          notes: string | null
          started_at: string | null
          status: string
          steps: string[]
          title: string
          user_id: string
          warnings: string[] | null
        }
        Insert: {
          added_at?: string
          benefits: string[]
          category: string
          completed_at?: string | null
          completion_percentage?: number
          description: string
          difficulty: string
          duration: string
          id?: string
          notes?: string | null
          started_at?: string | null
          status?: string
          steps: string[]
          title: string
          user_id: string
          warnings?: string[] | null
        }
        Update: {
          added_at?: string
          benefits?: string[]
          category?: string
          completed_at?: string | null
          completion_percentage?: number
          description?: string
          difficulty?: string
          duration?: string
          id?: string
          notes?: string | null
          started_at?: string | null
          status?: string
          steps?: string[]
          title?: string
          user_id?: string
          warnings?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
