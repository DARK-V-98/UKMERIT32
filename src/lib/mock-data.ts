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
  }
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
