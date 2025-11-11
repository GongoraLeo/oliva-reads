
export interface User {
  id: string;
  name: string;
  avatar_url: string;
  // Expanded profile fields
  username: string;
  birth_date: string;
  nationality: string;
  favorite_books: string[]; // Array of book titles
  favorite_authors: string[]; // Array of author names
  favorite_bookstore: string;
}

export interface Author {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  country?: string;
  continent?: string;
}

export interface Book {
  id: string;
  ol_key: string;
  title: string;
  author: Author;
  publisher: string;
  publication_year?: number;
  page_count: number;
  cover_url: string;
}

export enum ReadingFormat {
  Physical = 'físico',
  Digital = 'digital',
}

export enum ReadingStatus {
  CurrentlyReading = 'Leyendo actualmente',
  Read = 'Leído',
  Abandoned = 'Abandonado',
  ToBeRead = 'Por Leer',
}

export interface ReadingNote {
  id: string;
  date: string;
  content: string;
}

export interface ReadingLog {
  id: number;
  user_id: string;
  book: Book;
  start_date?: string;
  finish_date?: string;
  abandoned: boolean;
  format: ReadingFormat;
  rereading: boolean;
  user_rating?: 1 | 2 | 3 | 4 | 5;
  progress?: number; // page_number
  status: ReadingStatus;
  notes?: ReadingNote[];
}

export interface Review {
  id: string;
  user_id: string;
  book_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  review_text: string;
  date: string;
}

export interface BookRecommendation {
    title: string;
    author: string;
    reason: string;
}

export interface ReadingGoal {
  year: number;
  target_unit: 'books' | 'pages';
  target_value: number;
  current_value: number;
}

export interface Friendship {
    user_id_1: string;
    user_id_2: string;
    status: 'pending' | 'accepted';
}

export type ChallengeStatus = 'active' | 'completed' | 'failed';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    creator_id: string;
    participants_ids: string[];
    status: ChallengeStatus;
}
