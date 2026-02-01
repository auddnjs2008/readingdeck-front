import { Card } from "../card";
import { User } from "../user";

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  backgroundImage?: string | null;
  // relations (응답에 포함될 때만)
  user?: User;
  cards?: Card[];
  createdAt?: string;
  updatedAt?: string;
}
