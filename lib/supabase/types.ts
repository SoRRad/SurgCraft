export type Role =
  | "M3" | "M4" | "Intern" | "PGY-2" | "PGY-3"
  | "PGY-4" | "PGY-5" | "Fellow" | "Attending"

export type Specialty =
  | "Plastic Surgery" | "Orthopaedic Surgery"
  | "Emergency Med" | "Other"

export type SessionMode =
  | "tutor" | "case" | "pimping" | "preop" | "debrief" | "consult"

export type FlagStatus = "pending" | "reviewed" | "resolved"

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          handle: string
          role: Role
          specialty: Specialty
          on_hand_service: boolean
          primary_goal: string
          comfort_jsonb: Record<string, number>
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          mode: SessionMode
          started_at: string
          ended_at: string | null
          summary_jsonb: Record<string, unknown> | null
        }
        Insert: Omit<Database["public"]["Tables"]["sessions"]["Row"], "id" | "started_at">
        Update: Partial<Database["public"]["Tables"]["sessions"]["Insert"]>
      }
      messages: {
        Row: {
          id: string
          session_id: string
          role: "user" | "assistant"
          content: string
          citations_jsonb: unknown[] | null
          confidence: number | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>
      }
      cases: {
        Row: {
          id: string
          title: string
          stem: string
          cards_jsonb: Record<string, unknown>
          difficulty: "intro" | "intermediate" | "advanced"
          tags: string[]
          author: string
          verified: boolean
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["cases"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["cases"]["Insert"]>
      }
      case_attempts: {
        Row: {
          id: string
          user_id: string
          case_id: string
          transcript_jsonb: unknown[]
          score: number | null
          completed_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["case_attempts"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["case_attempts"]["Insert"]>
      }
      pearls: {
        Row: {
          id: string
          content: string
          attribution: string
          tags: string[]
          verified: boolean
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["pearls"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["pearls"]["Insert"]>
      }
      pearl_unlocks: {
        Row: {
          id: string
          user_id: string
          pearl_id: string
          unlocked_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["pearl_unlocks"]["Row"], "id">
        Update: never
      }
      kb_chunks: {
        Row: {
          id: string
          content: string
          embedding: number[] | null
          source: string
          source_type: string
          verified: boolean
        }
        Insert: Omit<Database["public"]["Tables"]["kb_chunks"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["kb_chunks"]["Insert"]>
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          question_ring: number
          case_ring: number
          review_ring: number
          date: string
        }
        Insert: Omit<Database["public"]["Tables"]["streaks"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["streaks"]["Insert"]>
      }
      flags: {
        Row: {
          id: string
          message_id: string
          user_id: string
          reason: string | null
          status: FlagStatus
          reviewed_by: string | null
          reviewed_at: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["flags"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["flags"]["Insert"]>
      }
    }
  }
}
