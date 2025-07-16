
import { Timestamp } from "firebase/firestore";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  imageHint?: string;
  lessonIds: string[];
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    duration: string;
    thumbnailUrl?: string;
    imageHint?: string;
    videoUrl?: string;
    transcript?: string;
    status: 'active' | 'disabled';
    courseId?: string; // To link back to course
}

export interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface Quiz {
    id: string; // Same as lessonId
    title: string;
    questions: Question[];
}

export interface User {
  id: string;
  uid: string;
  fullName: string;
  username?: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  status: 'active' | 'disabled';
  createdAt: Timestamp;
  profileComplete: boolean;
  whatsapp?: string;
}
