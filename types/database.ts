export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'owner' | 'client'
export type GalleryStatus = 'draft' | 'published' | 'archived'
export type ServiceType = 'video' | 'photo'
export type MediaType = 'photo' | 'video'
export type DownloadType = 'web' | 'full_res' | 'zip_all'
export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: UserRole
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: UserRole
          avatar_url?: string | null
          updated_at?: string
        }
      }
      galleries: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          description: string | null
          service_type: ServiceType
          status: GalleryStatus
          cover_photo_id: string | null
          is_public: boolean
          password_hash: string | null
          allow_downloads: boolean
          allow_favorites: boolean
          allow_orders: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          description?: string | null
          service_type: ServiceType
          status?: GalleryStatus
          cover_photo_id?: string | null
          is_public?: boolean
          password_hash?: string | null
          allow_downloads?: boolean
          allow_favorites?: boolean
          allow_orders?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          description?: string | null
          service_type?: ServiceType
          status?: GalleryStatus
          cover_photo_id?: string | null
          is_public?: boolean
          password_hash?: string | null
          allow_downloads?: boolean
          allow_favorites?: boolean
          allow_orders?: boolean
          expires_at?: string | null
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          gallery_id: string
          file_url: string
          preview_url: string
          thumbnail_url: string
          media_type: MediaType
          aspect_ratio: number | null
          width: number | null
          height: number | null
          file_size: number | null
          metadata: Json | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          file_url: string
          preview_url: string
          thumbnail_url: string
          media_type: MediaType
          aspect_ratio?: number | null
          width?: number | null
          height?: number | null
          file_size?: number | null
          metadata?: Json | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          file_url?: string
          preview_url?: string
          thumbnail_url?: string
          media_type?: MediaType
          aspect_ratio?: number | null
          width?: number | null
          height?: number | null
          file_size?: number | null
          metadata?: Json | null
          sort_order?: number
        }
      }
      gallery_invites: {
        Row: {
          id: string
          gallery_id: string
          client_email: string
          access_token: string
          expires_at: string | null
          has_accepted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          client_email: string
          access_token: string
          expires_at?: string | null
          has_accepted?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          client_email?: string
          access_token?: string
          expires_at?: string | null
          has_accepted?: boolean
        }
      }
      favorites: {
        Row: {
          id: string
          gallery_id: string
          media_id: string
          client_identifier: string
          created_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          media_id: string
          client_identifier: string
          created_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          media_id?: string
          client_identifier?: string
        }
      }
      downloads: {
        Row: {
          id: string
          gallery_id: string
          media_id: string | null
          client_identifier: string
          download_type: DownloadType
          created_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          media_id?: string | null
          client_identifier: string
          download_type: DownloadType
          created_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          media_id?: string | null
          client_identifier?: string
          download_type?: DownloadType
        }
      }
      orders: {
        Row: {
          id: string
          gallery_id: string
          client_identifier: string
          client_email: string | null
          client_name: string | null
          status: OrderStatus
          total_amount: number
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          client_identifier: string
          client_email?: string | null
          client_name?: string | null
          status?: OrderStatus
          total_amount: number
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          client_identifier?: string
          client_email?: string | null
          client_name?: string | null
          status?: OrderStatus
          total_amount?: number
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          media_id: string
          product_type: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          media_id: string
          product_type: string
          quantity?: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          media_id?: string
          product_type?: string
          quantity?: number
          price?: number
        }
      }
    }
  }
}
