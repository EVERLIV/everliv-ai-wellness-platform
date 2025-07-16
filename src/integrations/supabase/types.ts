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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_diagnostic_analyses: {
        Row: {
          ai_findings: Json | null
          analysis_status: string
          analysis_type: string
          confidence_score: number | null
          created_at: string
          id: string
          input_data: Json | null
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_findings?: Json | null
          analysis_status?: string
          analysis_type: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          input_data?: Json | null
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_findings?: Json | null
          analysis_status?: string
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          input_data?: Json | null
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_doctor_chats: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_doctor_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_doctor_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "ai_doctor_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          content: string
          created_at: string
          id: string
          priority: string
          recommendation_type: string
          source_data: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          priority?: string
          recommendation_type: string
          source_data?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          priority?: string
          recommendation_type?: string
          source_data?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      biological_age_snapshots: {
        Row: {
          accuracy_level: string
          accuracy_percentage: number
          age_difference: number
          analysis: string | null
          biological_age: number
          biomarkers_count: number
          chronological_age: number
          confidence_level: number
          created_at: string
          id: string
          missing_analyses: string[] | null
          recommendations: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_level?: string
          accuracy_percentage: number
          age_difference: number
          analysis?: string | null
          biological_age: number
          biomarkers_count?: number
          chronological_age: number
          confidence_level: number
          created_at?: string
          id?: string
          missing_analyses?: string[] | null
          recommendations?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_level?: string
          accuracy_percentage?: number
          age_difference?: number
          analysis?: string | null
          biological_age?: number
          biomarkers_count?: number
          chronological_age?: number
          confidence_level?: number
          created_at?: string
          id?: string
          missing_analyses?: string[] | null
          recommendations?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      biomarker_history: {
        Row: {
          biomarker_category: string
          biomarker_id: string
          biomarker_name: string
          created_at: string
          id: string
          normal_range: Json | null
          snapshot_id: string | null
          source: string
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          biomarker_category: string
          biomarker_id: string
          biomarker_name: string
          created_at?: string
          id?: string
          normal_range?: Json | null
          snapshot_id?: string | null
          source?: string
          unit: string
          user_id: string
          value: number
        }
        Update: {
          biomarker_category?: string
          biomarker_id?: string
          biomarker_name?: string
          created_at?: string
          id?: string
          normal_range?: Json | null
          snapshot_id?: string | null
          source?: string
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_biomarker_history_snapshot"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "biological_age_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      biomarkers: {
        Row: {
          analysis_id: string
          created_at: string
          id: string
          name: string
          reference_range: string | null
          status: string | null
          value: string | null
        }
        Insert: {
          analysis_id: string
          created_at?: string
          id?: string
          name: string
          reference_range?: string | null
          status?: string | null
          value?: string | null
        }
        Update: {
          analysis_id?: string
          created_at?: string
          id?: string
          name?: string
          reference_range?: string | null
          status?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biomarkers_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "medical_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string
          id: string
          thumbnail: string | null
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
          thumbnail?: string | null
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
          thumbnail?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cached_recommendations: {
        Row: {
          created_at: string
          id: string
          recommendations_data: Json
          recommendations_type: string
          source_hash: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recommendations_data?: Json
          recommendations_type: string
          source_hash: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recommendations_data?: Json
          recommendations_type?: string
          source_hash?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_health_metrics: {
        Row: {
          activity_level: number | null
          alcohol_units: number | null
          cigarettes_count: number | null
          created_at: string
          date: string
          exercise_minutes: number | null
          id: string
          mood_level: number | null
          notes: string | null
          nutrition_quality: number | null
          sleep_hours: number | null
          sleep_quality: number | null
          steps: number | null
          stress_level: number | null
          updated_at: string
          user_id: string
          water_intake: number | null
          weight: number | null
          workouts_count: number | null
        }
        Insert: {
          activity_level?: number | null
          alcohol_units?: number | null
          cigarettes_count?: number | null
          created_at?: string
          date?: string
          exercise_minutes?: number | null
          id?: string
          mood_level?: number | null
          notes?: string | null
          nutrition_quality?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          steps?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id: string
          water_intake?: number | null
          weight?: number | null
          workouts_count?: number | null
        }
        Update: {
          activity_level?: number | null
          alcohol_units?: number | null
          cigarettes_count?: number | null
          created_at?: string
          date?: string
          exercise_minutes?: number | null
          id?: string
          mood_level?: number | null
          notes?: string | null
          nutrition_quality?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          steps?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id?: string
          water_intake?: number | null
          weight?: number | null
          workouts_count?: number | null
        }
        Relationships: []
      }
      diagnosis_recommendations: {
        Row: {
          category: string
          contraindications: string[] | null
          created_at: string
          doctor_notes: string | null
          evidence_level: string | null
          id: string
          is_approved: boolean | null
          monitoring_schedule: string | null
          personalization_factors: Json | null
          priority: string
          recommendation_text: string
          synthesis_id: string
          target_values: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          contraindications?: string[] | null
          created_at?: string
          doctor_notes?: string | null
          evidence_level?: string | null
          id?: string
          is_approved?: boolean | null
          monitoring_schedule?: string | null
          personalization_factors?: Json | null
          priority?: string
          recommendation_text: string
          synthesis_id: string
          target_values?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          contraindications?: string[] | null
          created_at?: string
          doctor_notes?: string | null
          evidence_level?: string | null
          id?: string
          is_approved?: boolean | null
          monitoring_schedule?: string | null
          personalization_factors?: Json | null
          priority?: string
          recommendation_text?: string
          synthesis_id?: string
          target_values?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosis_recommendations_synthesis_id_fkey"
            columns: ["synthesis_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_synthesis"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          session_id: string
          updated_at: string
          upload_status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          session_id: string
          updated_at?: string
          upload_status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          session_id?: string
          updated_at?: string
          upload_status?: string
          user_id?: string
        }
        Relationships: []
      }
      diagnostic_recommendations: {
        Row: {
          ai_generated: boolean
          category: string
          created_at: string
          description: string
          doctor_approved: boolean | null
          id: string
          implementation_status: string
          priority: string
          recommendation_type: string
          session_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_generated?: boolean
          category: string
          created_at?: string
          description: string
          doctor_approved?: boolean | null
          id?: string
          implementation_status?: string
          priority?: string
          recommendation_type: string
          session_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_generated?: boolean
          category?: string
          created_at?: string
          description?: string
          doctor_approved?: boolean | null
          id?: string
          implementation_status?: string
          priority?: string
          recommendation_type?: string
          session_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diagnostic_sessions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          session_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          session_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          session_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diagnostic_synthesis: {
        Row: {
          agreements: Json | null
          ai_analysis: Json
          confidence_score: number
          created_at: string
          discrepancies: Json | null
          doctor_diagnosis: string
          doctor_feedback: Json | null
          follow_up_actions: Json | null
          id: string
          is_validated: boolean | null
          recommendations: Json | null
          session_id: string
          synthesis_type: string
          updated_at: string
          user_id: string
          validation_notes: string | null
        }
        Insert: {
          agreements?: Json | null
          ai_analysis?: Json
          confidence_score?: number
          created_at?: string
          discrepancies?: Json | null
          doctor_diagnosis: string
          doctor_feedback?: Json | null
          follow_up_actions?: Json | null
          id?: string
          is_validated?: boolean | null
          recommendations?: Json | null
          session_id: string
          synthesis_type: string
          updated_at?: string
          user_id: string
          validation_notes?: string | null
        }
        Update: {
          agreements?: Json | null
          ai_analysis?: Json
          confidence_score?: number
          created_at?: string
          discrepancies?: Json | null
          doctor_diagnosis?: string
          doctor_feedback?: Json | null
          follow_up_actions?: Json | null
          id?: string
          is_validated?: boolean | null
          recommendations?: Json | null
          session_id?: string
          synthesis_type?: string
          updated_at?: string
          user_id?: string
          validation_notes?: string | null
        }
        Relationships: []
      }
      doctor_diagnoses: {
        Row: {
          complications: string[] | null
          created_at: string
          doctor_comments: string | null
          icd_code: string | null
          icd_description: string | null
          id: string
          primary_diagnosis: string
          secondary_diagnoses: string[] | null
          session_id: string
          severity_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          complications?: string[] | null
          created_at?: string
          doctor_comments?: string | null
          icd_code?: string | null
          icd_description?: string | null
          id?: string
          primary_diagnosis: string
          secondary_diagnoses?: string[] | null
          session_id: string
          severity_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          complications?: string[] | null
          created_at?: string
          doctor_comments?: string | null
          icd_code?: string | null
          icd_description?: string | null
          id?: string
          primary_diagnosis?: string
          secondary_diagnoses?: string[] | null
          session_id?: string
          severity_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      doctor_specializations: {
        Row: {
          avg_consultation_duration: number | null
          common_conditions: string[] | null
          created_at: string
          description: string | null
          detailed_description: string | null
          health_areas: string[] | null
          id: string
          name: string
          required_education: string | null
          specialists_count: number | null
          treatment_methods: string[] | null
          typical_consultations: string[] | null
        }
        Insert: {
          avg_consultation_duration?: number | null
          common_conditions?: string[] | null
          created_at?: string
          description?: string | null
          detailed_description?: string | null
          health_areas?: string[] | null
          id?: string
          name: string
          required_education?: string | null
          specialists_count?: number | null
          treatment_methods?: string[] | null
          typical_consultations?: string[] | null
        }
        Update: {
          avg_consultation_duration?: number | null
          common_conditions?: string[] | null
          created_at?: string
          description?: string | null
          detailed_description?: string | null
          health_areas?: string[] | null
          id?: string
          name?: string
          required_education?: string | null
          specialists_count?: number | null
          treatment_methods?: string[] | null
          typical_consultations?: string[] | null
        }
        Relationships: []
      }
      ecg_records: {
        Row: {
          analysis_status: string
          created_at: string
          file_type: string | null
          file_url: string | null
          heart_rate: number | null
          id: string
          intervals: Json | null
          raw_data: Json | null
          rhythm_type: string | null
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_status?: string
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          heart_rate?: number | null
          id?: string
          intervals?: Json | null
          raw_data?: Json | null
          rhythm_type?: string | null
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_status?: string
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          heart_rate?: number | null
          id?: string
          intervals?: Json | null
          raw_data?: Json | null
          rhythm_type?: string | null
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feature_trials: {
        Row: {
          data: Json | null
          feature_name: string
          id: string
          used_at: string
          user_id: string
        }
        Insert: {
          data?: Json | null
          feature_name: string
          id?: string
          used_at?: string
          user_id: string
        }
        Update: {
          data?: Json | null
          feature_name?: string
          id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_analysis_requests: {
        Row: {
          analysis_result: Json | null
          created_at: string
          id: string
          image_url: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string
          id?: string
          image_url: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string
          id?: string
          image_url?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_entries: {
        Row: {
          calories: number
          carbs: number
          created_at: string
          entry_date: string
          fat: number
          food_name: string
          id: string
          image_url: string | null
          meal_type: string
          portion_size: string | null
          protein: number
          updated_at: string
          user_id: string
        }
        Insert: {
          calories?: number
          carbs?: number
          created_at?: string
          entry_date?: string
          fat?: number
          food_name: string
          id?: string
          image_url?: string | null
          meal_type: string
          portion_size?: string | null
          protein?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          entry_date?: string
          fat?: number
          food_name?: string
          id?: string
          image_url?: string | null
          meal_type?: string
          portion_size?: string | null
          protein?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_profiles: {
        Row: {
          created_at: string
          id: string
          profile_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_recommendations: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          source_data: Json | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          source_data?: Json | null
          status?: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          source_data?: Json | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medical_analyses: {
        Row: {
          analysis_type: string
          created_at: string
          id: string
          input_method: string | null
          results: Json
          summary: string | null
          test_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_type: string
          created_at?: string
          id?: string
          input_method?: string | null
          results: Json
          summary?: string | null
          test_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_type?: string
          created_at?: string
          id?: string
          input_method?: string | null
          results?: Json
          summary?: string | null
          test_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medical_article_embeddings: {
        Row: {
          article_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_article_embeddings_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "medical_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_articles: {
        Row: {
          article_type: string
          author: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          medical_review_status: string | null
          published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          article_type: string
          author?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          medical_review_status?: string | null
          published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          article_type?: string
          author?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          medical_review_status?: string | null
          published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "medical_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      moscow_specialists: {
        Row: {
          achievements: string[] | null
          address: string | null
          bio: string | null
          consultation_price: number | null
          created_at: string | null
          education: string | null
          email: string | null
          experience_years: number | null
          id: string
          languages: string[] | null
          metro_station: string | null
          name: string
          phone: string | null
          photo_url: string | null
          rating: number | null
          reviews_count: number | null
          services: string[] | null
          specialization_id: string | null
          updated_at: string | null
          working_hours: string | null
          workplace: string | null
        }
        Insert: {
          achievements?: string[] | null
          address?: string | null
          bio?: string | null
          consultation_price?: number | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          languages?: string[] | null
          metro_station?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          reviews_count?: number | null
          services?: string[] | null
          specialization_id?: string | null
          updated_at?: string | null
          working_hours?: string | null
          workplace?: string | null
        }
        Update: {
          achievements?: string[] | null
          address?: string | null
          bio?: string | null
          consultation_price?: number | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          languages?: string[] | null
          metro_station?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          reviews_count?: number | null
          services?: string[] | null
          specialization_id?: string | null
          updated_at?: string | null
          working_hours?: string | null
          workplace?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moscow_specialists_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "doctor_specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          categories: string[]
          created_at: string
          email: string
          frequency: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          categories?: string[]
          created_at?: string
          email: string
          frequency?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          categories?: string[]
          created_at?: string
          email?: string
          frequency?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      nutrition_goals: {
        Row: {
          created_at: string
          daily_calories: number
          daily_carbs: number
          daily_fat: number
          daily_protein: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_calories?: number
          daily_carbs?: number
          daily_fat?: number
          daily_protein?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_calories?: number
          daily_carbs?: number
          daily_fat?: number
          daily_protein?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      page_contents: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          page_id: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          page_id: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
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
      patient_reviews: {
        Row: {
          article_id: string | null
          created_at: string
          email: string | null
          id: string
          is_published: boolean | null
          is_verified: boolean | null
          patient_name: string | null
          rating: number | null
          review_text: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          patient_name?: string | null
          rating?: number | null
          review_text: string
        }
        Update: {
          article_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          patient_name?: string | null
          rating?: number | null
          review_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_reviews_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "medical_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_recommendations: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          description: string
          id: string
          is_completed: boolean
          priority: string
          source_data: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string
          description: string
          id?: string
          is_completed?: boolean
          priority?: string
          source_data?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          is_completed?: boolean
          priority?: string
          source_data?: Json | null
          title?: string
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
          nickname: string | null
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
          nickname?: string | null
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
          nickname?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      protocol_embeddings: {
        Row: {
          created_at: string
          id: string
          protocol_features: Json | null
          protocol_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          protocol_features?: Json | null
          protocol_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          protocol_features?: Json | null
          protocol_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_embeddings_protocol_id_fkey"
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
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
          dosage: string | null
          id: string
          protocol_id: string
          supplement_name: string
          taken: boolean
          taken_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day: number
          dosage?: string | null
          id?: string
          protocol_id: string
          supplement_name: string
          taken?: boolean
          taken_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day?: number
          dosage?: string | null
          id?: string
          protocol_id?: string
          supplement_name?: string
          taken?: boolean
          taken_at?: string | null
          updated_at?: string
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
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day: number
          energy_level: number
          id?: string
          notes?: string | null
          protocol_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day?: number
          energy_level?: number
          id?: string
          notes?: string | null
          protocol_id?: string
          updated_at?: string
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
      specialist_reviews: {
        Row: {
          consultation_date: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          is_verified: boolean | null
          patient_name: string | null
          rating: number | null
          review_text: string | null
          specialist_id: string | null
        }
        Insert: {
          consultation_date?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          patient_name?: string | null
          rating?: number | null
          review_text?: string | null
          specialist_id?: string | null
        }
        Update: {
          consultation_date?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          patient_name?: string | null
          rating?: number | null
          review_text?: string | null
          specialist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specialist_reviews_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "moscow_specialists"
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
          limits: Json
          name: string
          price: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          features: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          limits?: Json
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
          limits?: Json
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
          plan_type: string
          started_at: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          plan_type: string
          started_at?: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          plan_type?: string
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          admin_notes: string | null
          browser_info: string | null
          created_at: string
          id: string
          message: string
          priority: string
          problem_type: string | null
          rating: number | null
          rating_comment: string | null
          request_type: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          subject: string
          updated_at: string
          user_email: string
          user_name: string
        }
        Insert: {
          admin_notes?: string | null
          browser_info?: string | null
          created_at?: string
          id?: string
          message: string
          priority?: string
          problem_type?: string | null
          rating?: number | null
          rating_comment?: string | null
          request_type: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_email: string
          user_name: string
        }
        Update: {
          admin_notes?: string | null
          browser_info?: string | null
          created_at?: string
          id?: string
          message?: string
          priority?: string
          problem_type?: string | null
          rating?: number | null
          rating_comment?: string | null
          request_type?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_email?: string
          user_name?: string
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          created_at: string
          feature_type: string
          id: string
          period_end: string
          period_start: string
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_type: string
          id?: string
          period_end: string
          period_start: string
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          feature_type?: string
          id?: string
          period_end?: string
          period_start?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string
          achievement_name: string
          achievement_type: string
          data: Json | null
          description: string | null
          id: string
          points: number
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_name: string
          achievement_type: string
          data?: Json | null
          description?: string | null
          id?: string
          points?: number
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_name?: string
          achievement_type?: string
          data?: Json | null
          description?: string | null
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          analytics_data: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_data: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_data?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_health_goals: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          end_date: string | null
          goal_type: string
          id: string
          is_active: boolean
          is_custom: boolean | null
          priority: string | null
          progress_percentage: number | null
          start_date: string
          target_exercise_minutes: number | null
          target_sleep_hours: number | null
          target_steps: number | null
          target_stress_level: number | null
          target_water_intake: number | null
          target_weight: number | null
          title: string | null
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean
          is_custom?: boolean | null
          priority?: string | null
          progress_percentage?: number | null
          start_date?: string
          target_exercise_minutes?: number | null
          target_sleep_hours?: number | null
          target_steps?: number | null
          target_stress_level?: number | null
          target_water_intake?: number | null
          target_weight?: number | null
          title?: string | null
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean
          is_custom?: boolean | null
          priority?: string | null
          progress_percentage?: number | null
          start_date?: string
          target_exercise_minutes?: number | null
          target_sleep_hours?: number | null
          target_steps?: number | null
          target_stress_level?: number | null
          target_water_intake?: number | null
          target_weight?: number | null
          title?: string | null
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences_embeddings: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          preference_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          preference_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          preference_type?: string
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
          created_at: string
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
          created_at?: string
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
          created_at?: string
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
      user_recipes: {
        Row: {
          category: string | null
          cooking_time: number | null
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          ingredients: Json
          instructions: Json
          nutrition_info: Json | null
          source_foods: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          cooking_time?: number | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          ingredients?: Json
          instructions?: Json
          nutrition_info?: Json | null
          source_foods?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          cooking_time?: number | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          ingredients?: Json
          instructions?: Json
          nutrition_info?: Json | null
          source_foods?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_health_ai_profile: {
        Row: {
          age: number | null
          allergies: string[] | null
          analyses_count: number | null
          avg_calories_30d: number | null
          avg_carbs_30d: number | null
          avg_exercise_30d: number | null
          avg_fat_30d: number | null
          avg_mood_30d: number | null
          avg_nutrition_30d: number | null
          avg_protein_30d: number | null
          avg_sleep_30d: number | null
          avg_steps_30d: number | null
          avg_stress_30d: number | null
          avg_water_30d: number | null
          avg_weight_30d: number | null
          biomarkers: Json | null
          bmi: number | null
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          health_metrics_count_30d: number | null
          health_profile_created: string | null
          health_profile_data: Json | null
          height: number | null
          last_analysis_date: string | null
          last_name: string | null
          medical_conditions: string[] | null
          medications: string[] | null
          nutrition_tracking_days_30d: number | null
          profile_created: string | null
          profile_goals: string[] | null
          profile_updated: string | null
          user_goals: Json | null
          user_id: string | null
          weight: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_dynamic_health_score: {
        Args: { user_id_param: string; days_back?: number }
        Returns: number
      }
      has_role: {
        Args:
          | { _user_id: string; _role: Database["public"]["Enums"]["app_role"] }
          | { user_id: number; role_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      recommend_protocols_for_user: {
        Args: {
          user_id_param: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          protocol_id: string
          title: string
          description: string
          category: string
          similarity: number
          recommendation_reason: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
