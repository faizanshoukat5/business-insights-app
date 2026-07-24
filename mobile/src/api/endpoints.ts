import client from "./client";

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

// The response interceptor in client.ts unwraps the envelope, so each call
// resolves directly to the `data` payload (hence the double cast).

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await client.post("/login", { email, password });
  return data as unknown as LoginResponse;
}

export async function getBusiness(): Promise<Business> {
  const data = await client.get("/business");
  return data as unknown as Business;
}

export async function getInsights(): Promise<Insights> {
  const data = await client.get("/insights");
  return data as unknown as Insights;
}

export async function getReviews(): Promise<Review[]> {
  const data = await client.get("/reviews");
  return data as unknown as Review[];
}
