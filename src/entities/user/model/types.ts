import { Book } from "@/entities/book/model/types";

export type AuthProvider = "google" | "kakao";

export interface User {
  id: number;
  name: string;
  email: string | null;
  provider: AuthProvider;
  profile?: string | null;
  providerUserId: string;
  // relations
  books?: Book[];
  createdAt?: string;
  updatedAt?: string;
}
