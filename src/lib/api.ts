import axios, { AxiosResponse } from 'axios';
import { User, RegisterRequest, Property, InquiryRequest, InquiryResponse, Favorite, AdminStats, ApiResponse, TokenResponse, PaginatedApiResponse, PropertyQueryParams } from '@/types/types';

// interface PropertyQueryParams {
//   city?: string;
//   price_min?: string;
//   price_max?: string;
//   listing_type?: 'sell' | 'rent' | '' | undefined;
//   is_featured?: boolean;
//   property_type?: string;
//   bedrooms?: number;
//   bathrooms?: number;
//   search?: string;
// }

const API_URL = 'https://real-estate-backend-ur4i.onrender.com/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  const isGetRequest = config.method?.toLowerCase() === 'get';
  const isPropertiesEndpoint = config.url?.includes('properties/');

  //  Allow unauthenticated GET requests to /properties/
  const isPublic = isGetRequest && isPropertiesEndpoint;

  //  Attach token to all other requests
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const register = (data: RegisterRequest): Promise<AxiosResponse<TokenResponse>> => api.post('register/', data);
export const login = (data: { username: string; password: string }): Promise<AxiosResponse<TokenResponse>> => api.post('token/', data);
export const refreshToken = (refresh: string): Promise<AxiosResponse<{ access: string }>> => api.post('token/refresh/', { refresh });
export const getUser = (): Promise<AxiosResponse<User>> => api.get('user/');
export const updateUser = (data: Partial<User>): Promise<AxiosResponse<User>> => api.patch('user/', data);
export const getProperties = (params: PropertyQueryParams = {}): Promise<AxiosResponse<PaginatedApiResponse<Property>>> =>
  api.get('properties/', { params });
export const getProperty = (id: number): Promise<AxiosResponse<Property>> => api.get(`properties/${id}/`);
export const createProperty = (data: Partial<Property>): Promise<AxiosResponse<Property>> => api.post('properties/', data);
export const updateProperty = (id: number, data: Partial<Property>): Promise<AxiosResponse<Property>> => api.patch(`properties/${id}/`, data);
export const deleteProperty = (id: number): Promise<AxiosResponse<void>> => api.delete(`properties/${id}/`);
export const addFavorite = (propertyId: number): Promise<AxiosResponse<void>> => api.post(`user/add-favorite/${propertyId}/`);
export const removeFavorite = (propertyId: number): Promise<AxiosResponse<void>> => api.post(`user/remove-favorite/${propertyId}/`);
export const getFavorites = (): Promise<AxiosResponse<Favorite[]>> => api.get('favorites/');
export const createInquiry = (data: InquiryRequest): Promise<AxiosResponse<InquiryResponse>> => api.post('inquiries/', data);
export const getAdminStats = (): Promise<AxiosResponse<AdminStats>> => api.get('admin/stats/');
export const getAdminUsers = (): Promise<AxiosResponse<ApiResponse<User>>> => api.get('admin/users/');
export const getAdminProperties = (): Promise<AxiosResponse<ApiResponse<Property>>> => api.get('admin/properties/');

export default api;