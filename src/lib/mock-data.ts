
export const courses = [
  {
    id: "1",
    title: "Beginner's English Grammar",
    description: "A complete guide to the fundamental grammar rules for beginner learners.",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "grammar book",
    lessonIds: ["1", "4"],
  },
  {
    id: "2",
    title: "Conversational English for Professionals",
    description: "Improve your speaking and listening skills for business and social situations.",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "people conversing office",
    lessonIds: ["2", "3", "5", "6"],
  },
  {
    id: "basic-english",
    title: "Basic English Course",
    description: "Your complete guide to mastering English, from grammar and speaking to listening and writing.",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "english learning pathway",
    lessonIds: [
      "g1", "g2", "g3", "g4", "g5", "g6", 
      "s1", "s2", "s3", "s4", "s5", "s6", "s7",
      "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8",
      "r1", "r2",
      "w1"
    ],
  }
];

export const lessons = [
  {
    id: "1",
    title: "Mastering Present Tenses",
    description: "Understand the difference between Present Simple and Present Continuous.",
    category: "Grammar",
    difficulty: "Beginner",
    duration: "12 min",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "teacher grammar",
    transcript: "Hello and welcome to our first lesson on mastering present tenses...",
  },
  {
    id: "2",
    title: "Essential Business Vocabulary",
    description: "Learn key terms used in the corporate world.",
    category: "Vocabulary",
    difficulty: "Intermediate",
    duration: "15 min",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "business meeting",
    transcript: "In today's business world, using the right vocabulary is crucial...",
  },
  {
    id: "3",
    title: "The Art of Small Talk",
    description: "Gain confidence in starting and maintaining conversations.",
    category: "Speaking",
    difficulty: "Beginner",
    duration: "10 min",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "people talking",
    transcript: "Small talk is a big part of daily interactions. Let's explore how to master it...",
  },
  {
    id: "4",
    title: "Advanced Conditional Clauses",
    description: "Explore the nuances of first, second, third, and mixed conditionals.",
    category: "Grammar",
    difficulty: "Advanced",
    duration: "20 min",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "complex chart",
    transcript: "Conditional clauses can be tricky, but they are essential for expressing complex ideas...",
  },
    {
    id: "5",
    title: "Listening for Main Ideas",
    description: "Improve your listening skills by focusing on key information.",
    category: "Listening",
    difficulty: "Intermediate",
    duration: "18 min",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "person headphones",
    transcript: "Being a good listener is not just about hearing, but about understanding...",
  },
  {
    id: "6",
    title: "Writing Formal Emails",
    description: "Learn the structure and phrases for professional email communication.",
    category: "Writing",
    difficulty: "Intermediate",
    duration: "14 min",
    thumbnailUrl: "https://placehold.co/400x225.png",
    imageHint: "writing email",
    transcript: "In this lesson, we will cover the essentials of writing a formal email...",
  },
  // Basic English Course - Grammar
  { id: "g1", title: "Grammar Lesson 1", description: "Learn the basics of English grammar.", category: "Grammar", difficulty: "Beginner", duration: "10 min", videoUrl: "https://www.youtube.com/embed/UHU9o_r32cQ", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "grammar lesson" },
  { id: "g2", title: "Grammar Lesson 2", description: "Continue your grammar journey.", category: "Grammar", difficulty: "Beginner", duration: "12 min", videoUrl: "https://www.youtube.com/embed/UHSCAUnsyBc", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "grammar book" },
  { id: "g3", title: "Grammar Lesson 3", description: "Intermediate grammar concepts.", category: "Grammar", difficulty: "Beginner", duration: "15 min", videoUrl: "https://www.youtube.com/embed/u4D8PU5C6jw", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "grammar chart" },
  { id: "g4", title: "Grammar Lesson 4", description: "Advanced grammar topics.", category: "Grammar", difficulty: "Beginner", duration: "11 min", videoUrl: "https://www.youtube.com/embed/2oDXqdHM2xw", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "english textbook" },
  { id: "g5", title: "Grammar Lesson 5", description: "Complex sentence structures.", category: "Grammar", difficulty: "Beginner", duration: "13 min", videoUrl: "https://www.youtube.com/embed/CsHIFCbA7dw", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "sentence diagram" },
  { id: "g6", title: "Grammar Lesson 6", description: "Review and practice.", category: "Grammar", difficulty: "Beginner", duration: "14 min", videoUrl: "https://www.youtube.com/embed/KMzqVt0XgY8", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "grammar review" },
  // Basic English Course - Speaking
  { id: "s1", title: "Speaking Practice 1", description: "Practice your speaking skills.", category: "Speaking", difficulty: "Beginner", duration: "5 min", videoUrl: "https://iframe.mediadelivery.net/embed/175985/9a3ec534-460a-4c78-bea3-6144153c44ae", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "person speaking" },
  { id: "s2", title: "Speaking Practice 2", description: "Improve your pronunciation.", category: "Speaking", difficulty: "Beginner", duration: "6 min", videoUrl: "https://iframe.mediadelivery.net/embed/175985/d9200c60-1f50-4f60-b767-f4f9f0c661bf", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "mouth speaking" },
  { id: "s3", title: "Speaking Practice 3", description: "Conversational practice.", category: "Speaking", difficulty: "Beginner", duration: "7 min", videoUrl: "https://iframe.mediadelivery.net/embed/175985/766da302-5063-479d-9916-8a641d154c2c", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "people talking" },
  { id: "s4", title: "Speaking Practice 4", description: "Build your confidence.", category: "Speaking", difficulty: "Beginner", duration: "5 min", videoUrl: "https://iframe.mediadelivery.net/embed/175985/2c092572-41e3-4b6a-8514-9a6e6e0a2cce", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "confident speaker" },
  { id: "s5", title: "Speaking Practice 5", description: "Common phrases and idioms.", category: "Speaking", difficulty: "Beginner", duration: "8 min", videoUrl: "https://iframe.mediadelivery.net/embed/175985/8a0f0e2d-c187-494b-a55e-73e1dbad9124", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "speech bubbles" },
  { id: "s6", title: "Speaking Practice 6", description: "Role-playing scenarios.", category: "Speaking", difficulty: "Beginner", duration: "9 min", videoUrl: "https://iframe.mediadelivery.net/embed/175985/4dfb2b59-e7d1-495f-a8c4-9624f4b5bea9", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "acting masks" },
  { id: "s7", title: "Speaking Practice 7", description: "Review and feedback.", category: "Speaking", difficulty: "Beginner", duration: "6 min", videoUrl: "https://iframe.mediadelivery.net/embed/175985/cfdded83-9b4a-47ea-9a1b-839149bf98fb", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "checklist" },
  // Basic English Course - Listening
  { id: "l1", title: "Listening Skills 1", description: "Sharpen your listening ability.", category: "Listening", difficulty: "Beginner", duration: "7 min", videoUrl: "https://iframe.mediadelivery.net/embed/181068/2f684954-58e5-4634-a651-e03e6af41509", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "ear audio" },
  { id: "l2", title: "Listening Skills 2", description: "Understand different accents.", category: "Listening", difficulty: "Beginner", duration: "8 min", videoUrl: "https://iframe.mediadelivery.net/embed/181068/347bf907-6baf-4608-a434-5df4ee6bfe0d", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "world map" },
  { id: "l3", title: "Listening Skills 3", description: "Listening for details.", category: "Listening", difficulty: "Beginner", duration: "6 min", videoUrl: "https://iframe.mediadelivery.net/embed/181068/cdea6f2f-ee90-4767-8f2c-f516486452b1", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "magnifying glass" },
  { id: "l4", title: "Listening Skills 4", description: "Comprehension exercises.", category: "Listening", difficulty: "Beginner", duration: "7 min", videoUrl: "https://iframe.mediadelivery.net/embed/181068/092f046f-63b2-471d-8f42-b0f7ca8c7bc3", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "question mark" },
  { id: "l5", title: "Listening Skills 5", description: "Audio dialogues.", category: "Listening", difficulty: "Beginner", duration: "5 min", videoUrl: "https://iframe.mediadelivery.net/embed/175970/d60ada2c-3916-4c3c-9042-d5cd90c0e724", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "two people talking" },
  { id: "l6", title: "Listening Skills 6", description: "Podcast-style lessons.", category: "Listening", difficulty: "Beginner", duration: "8 min", videoUrl: "https://iframe.mediadelivery.net/embed/175970/d60ada2c-3916-4c3c-9042-d5cd90c0e724", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "microphone podcast" },
  { id: "l7", title: "Listening Skills 7", description: "News and reports.", category: "Listening", difficulty: "Beginner", duration: "9 min", videoUrl: "https://iframe.mediadelivery.net/embed/175970/dfbe73e4-4063-475e-a622-c8ba5ac63a0c", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "newspaper" },
  { id: "l8", title: "Listening Skills 8", description: "Final listening challenge.", category: "Listening", difficulty: "Beginner", duration: "10 min", videoUrl: "https://iframe.mediadelivery.net/embed/175970/841a8a76-ee90-4615-b1a5-545eff11166c", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "trophy" },
  // Basic English Course - Reading
  { id: "r1", title: "Reading Skills 1", description: "Learn to read and comprehend text.", category: "Reading", difficulty: "Beginner", duration: "10 min", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "person reading book" },
  { id: "r2", title: "Reading Skills 2", description: "Analyzing texts for meaning.", category: "Reading", difficulty: "Beginner", duration: "12 min", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "magnifying glass text" },
  // Basic English Course - Writing
  { id: "w1", title: "Writing Skills 1", description: "Basics of sentence construction.", category: "Writing", difficulty: "Beginner", duration: "15 min", thumbnailUrl: "https://placehold.co/400x225.png", imageHint: "person writing notes" },
];

export const quizzes: { [key: string]: any } = {
  "1": {
    title: "Present Tenses Quiz",
    questions: [
      {
        question: "Which tense describes a habitual action?",
        options: ["Present Simple", "Present Continuous", "Present Perfect"],
        correctAnswer: "Present Simple",
      },
      {
        question: "Complete the sentence: 'Look! The sun ______.'",
        options: ["shines", "is shining", "has shone"],
        correctAnswer: "is shining",
      },
    ],
  },
  "2": {
    title: "Business Vocabulary Quiz",
    questions: [
      {
        question: "What does 'ROI' stand for?",
        options: ["Return on Investment", "Rate of Inflation", "Risk of Insolvency"],
        correctAnswer: "Return on Investment",
      },
    ],
  },
  "3": {
    title: "Small Talk Quiz",
    questions: [
      {
        question: "Which is a good opening question for small talk?",
        options: ["How much do you earn?", "Are you enjoying the weather today?", "What are your political views?"],
        correctAnswer: "Are you enjoying the weather today?",
      },
    ],
  },
   "4": {
    title: "Advanced Conditionals Quiz",
    questions: [
      {
        question: "Which type of conditional refers to an impossible past condition?",
        options: ["First Conditional", "Second Conditional", "Third Conditional"],
        correctAnswer: "Third Conditional",
      },
    ],
  },
  "5": {
    title: "Listening Skills Quiz",
    questions: [
      {
        question: "What is the first step in listening for main ideas?",
        options: ["Listen for specific details", "Try to understand every word", "Identify the topic"],
        correctAnswer: "Identify the topic",
      },
    ],
  },
   "6": {
    title: "Formal Emails Quiz",
    questions: [
      {
        question: "Which closing is appropriate for a formal email?",
        options: ["Cheers", "Best", "Yours sincerely"],
        correctAnswer: "Yours sincerely",
      },
    ],
  }
  // Quizzes for the new course can be added here later
};

export const forums = [
  {
    id: "1",
    title: "Grammar Questions",
    description: "Ask anything about English grammar rules and structures.",
    threads: 124,
    posts: 876,
  },
  {
    id: "2",
    title: "Vocabulary & Idioms",
    description: "Discuss new words, phrases, and idiomatic expressions.",
    threads: 88,
    posts: 642,
  },
  {
    id: "3",
    title: "Speaking & Pronunciation",
    description: "Share tips and practice your speaking skills.",
    threads: 67,
    posts: 451,
  },
    {
    id: "4",
    title: "General Discussion",
    description: "Chat about anything related to learning English or culture.",
    threads: 210,
    posts: 1503,
  },
];

export const users = [
    { id: '1', name: 'Alex Turner', email: 'alex.t@example.com', role: 'Student', enrolled: '2023-10-26', progress: 75, avatar: 'https://placehold.co/100x100.png' },
    { id: '2', name: 'Samantha Lee', email: 'sam.l@example.com', role: 'Student', enrolled: '2023-11-15', progress: 50, avatar: 'https://placehold.co/100x100.png' },
    { id: '3', name: 'David Chen', email: 'david.c@example.com', role: 'Student', enrolled: '2024-01-05', progress: 90, avatar: 'https://placehold.co/100x100.png' },
    { id: '4', name: 'Maria Garcia', email: 'maria.g@example.com', role: 'Student', enrolled: '2024-02-20', progress: 30, avatar: 'https://placehold.co/100x100.png' },
    { id: '5', name: 'James Wilson', email: 'james.w@example.com', role: 'Student', enrolled: '2024-03-10', progress: 100, status: 'Completed', avatar: 'https://placehold.co/100x100.png' },
];

export const siteStats = {
  totalUsers: 1482,
  activeCourses: 15,
  completedLessons: 2390,
  forumThreads: 489,
};
