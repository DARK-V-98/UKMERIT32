
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
    thumbnailUrl: string;
    imageHint: string;
    videoUrl?: string;
    transcript?: string;
}
