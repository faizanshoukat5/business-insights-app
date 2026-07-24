import { getData, postData } from "./client";

export interface User {
  id: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  rating: number;
  total_reviews: number;
}

export interface Insights {
  id: string;
  profile_views: number;
  search_views: number;
  website_clicks: number;
  phone_calls: number;
  direction_requests: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// The response interceptor in client.ts unwraps the envelope, so getData/postData
// resolve directly to the typed `data` payload.

export async function login(email: string, password: string): Promise<LoginResponse> {
  return postData<LoginResponse>("/login", { email, password });
}

export async function getBusiness(): Promise<Business> {
  return getData<Business>("/business");
}

export async function getInsights(): Promise<Insights> {
  return getData<Insights>("/insights");
}

export async function getReviews(): Promise<Review[]> {
  return getData<Review[]>("/reviews");
}
