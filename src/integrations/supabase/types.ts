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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alumni: {
        Row: {
          advice_text: string
          approved: boolean
          bac_score: number
          created_at: string
          id: string
          name: string
          resume_url: string | null
          stream: Database["public"]["Enums"]["student_stream"]
        }
        Insert: {
          advice_text: string
          approved?: boolean
          bac_score: number
          created_at?: string
          id?: string
          name: string
          resume_url?: string | null
          stream: Database["public"]["Enums"]["student_stream"]
        }
        Update: {
          advice_text?: string
          approved?: boolean
          bac_score?: number
          created_at?: string
          id?: string
          name?: string
          resume_url?: string | null
          stream?: Database["public"]["Enums"]["student_stream"]
        }
        Relationships: []
      }
      bookings: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          request_description: string
          status: Database["public"]["Enums"]["booking_status"]
          student_id: string
          subject: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          request_description: string
          status?: Database["public"]["Enums"]["booking_status"]
          student_id: string
          subject: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          request_description?: string
          status?: Database["public"]["Enums"]["booking_status"]
          student_id?: string
          subject?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string
          exam_pdf_url: string | null
          id: string
          solution_pdf_url: string | null
          stream: Database["public"]["Enums"]["student_stream"]
          subject_id: string
          year: number
        }
        Insert: {
          created_at?: string
          exam_pdf_url?: string | null
          id?: string
          solution_pdf_url?: string | null
          stream: Database["public"]["Enums"]["student_stream"]
          subject_id: string
          year: number
        }
        Update: {
          created_at?: string
          exam_pdf_url?: string | null
          id?: string
          solution_pdf_url?: string | null
          stream?: Database["public"]["Enums"]["student_stream"]
          subject_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "exams_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          chapter: string
          completed_at: string | null
          created_at: string
          difficulty: string
          id: string
          questions_json: Json
          score: number | null
          student_id: string
          subject_id: string
          total_questions: number
        }
        Insert: {
          chapter: string
          completed_at?: string | null
          created_at?: string
          difficulty?: string
          id?: string
          questions_json: Json
          score?: number | null
          student_id: string
          subject_id: string
          total_questions: number
        }
        Update: {
          chapter?: string
          completed_at?: string | null
          created_at?: string
          difficulty?: string
          id?: string
          questions_json?: Json
          score?: number | null
          student_id?: string
          subject_id?: string
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          id: string
          name: string
          stream: Database["public"]["Enums"]["student_stream"]
          updated_at: string
          user_id: string
          whatsapp: string | null
          year_of_study: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          stream: Database["public"]["Enums"]["student_stream"]
          updated_at?: string
          user_id: string
          whatsapp?: string | null
          year_of_study: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          stream?: Database["public"]["Enums"]["student_stream"]
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
          year_of_study?: number
        }
        Relationships: []
      }
      subjects: {
        Row: {
          chapters: Json
          created_at: string
          id: string
          name: string
          stream: Database["public"]["Enums"]["student_stream"]
        }
        Insert: {
          chapters?: Json
          created_at?: string
          id?: string
          name: string
          stream: Database["public"]["Enums"]["student_stream"]
        }
        Update: {
          chapters?: Json
          created_at?: string
          id?: string
          name?: string
          stream?: Database["public"]["Enums"]["student_stream"]
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_interval: string
          created_at: string
          features: Json
          id: string
          is_active: boolean
          name: string
          plan_code: string
          price_dzd: number
        }
        Insert: {
          billing_interval?: string
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          plan_code: string
          price_dzd: number
        }
        Update: {
          billing_interval?: string
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          plan_code?: string
          price_dzd?: number
        }
        Relationships: []
      }
      summaries: {
        Row: {
          ai_response: string
          chapter: string
          created_at: string
          id: string
          is_cached: boolean
          student_id: string
          subject_id: string
        }
        Insert: {
          ai_response: string
          chapter: string
          created_at?: string
          id?: string
          is_cached?: boolean
          student_id: string
          subject_id: string
        }
        Update: {
          ai_response?: string
          chapter?: string
          created_at?: string
          id?: string
          is_cached?: boolean
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "summaries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "summaries_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          session_date: string
          status: string
          student_id: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_date: string
          status?: string
          student_id?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_date?: string
          status?: string
          student_id?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          allowed_subjects: string[] | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_code: string
          quiz_count_current_month: number | null
          quiz_limit_per_month: number | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          teacher_sessions_limit: number | null
          teacher_sessions_used: number | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allowed_subjects?: string[] | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_code: string
          quiz_count_current_month?: number | null
          quiz_limit_per_month?: number | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          teacher_sessions_limit?: number | null
          teacher_sessions_used?: number | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allowed_subjects?: string[] | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_code?: string
          quiz_count_current_month?: number | null
          quiz_limit_per_month?: number | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          teacher_sessions_limit?: number | null
          teacher_sessions_used?: number | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          chapter: string
          created_at: string
          id: string
          subject_id: string
          title: string
          uploaded_by_admin: boolean
          youtube_link: string
        }
        Insert: {
          chapter: string
          created_at?: string
          id?: string
          subject_id: string
          title: string
          uploaded_by_admin?: boolean
          youtube_link: string
        }
        Update: {
          chapter?: string
          created_at?: string
          id?: string
          subject_id?: string
          title?: string
          uploaded_by_admin?: boolean
          youtube_link?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_quiz_limit: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_subject_access: {
        Args: { subject_name: string; user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status:
        | "first_offer"
        | "second_offer"
        | "third_offer"
        | "completed"
      student_stream:
        | "science"
        | "literature"
        | "math_tech"
        | "economics"
        | "languages"
      user_role: "student" | "admin"
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
    Enums: {
      booking_status: [
        "first_offer",
        "second_offer",
        "third_offer",
        "completed",
      ],
      student_stream: [
        "science",
        "literature",
        "math_tech",
        "economics",
        "languages",
      ],
      user_role: ["student", "admin"],
    },
  },
} as const
