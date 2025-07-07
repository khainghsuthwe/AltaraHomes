export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'user' | 'agent' | 'admin';
  phone: string;
  bio: string;
  profile_picture?: string | null;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  user_type?: 'user' | 'agent' | 'admin';
  phone?: string;
  bio?: string;
  profile_picture?: string | null;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  listing_type: 'sell' | 'rent';
  property_type: 'house' | 'apartment' | 'condo' | 'land';
  address: string;
  city: string;
  state: string;
  zip_code: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  latitude: number | null;
  longitude: number | null;
  is_available: boolean;
  sold_or_rented_at: string | null;
  is_featured: boolean;
  feature_cost: number | null;
  amenities: string[];
  image_urls: string[];
  created_at: string;
  updated_at: string;
  agent: string;
  favorited_by?: { user: { id: number } }[];
}

export interface InquiryRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  property: number;
}

export interface InquiryResponse {
  id: number;
  property: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface Favorite {
  id: number;
  property: Property;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_properties: number;
  total_inquiries: number;
}

export interface ApiResponse<T> {
  data: T;
  results?: T[];
}

export interface PaginatedApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PropertyQueryParams {
  city?: string;
  price_min?: string;
  price_max?: string;
  listing_type?: 'sell' | 'rent' | '';
  is_featured?: boolean;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
  page?: number;
  page_size?: number;
  agent_id?: number;
}