export type CourseIdea = {
  title: string;
  category: string;
  description: string;
  sourceTitle: string;
};

// Catalog concepts based only on locally supplied PDF filenames. Their contents
// have not been reviewed or turned into lessons.
export const courseIdeas: CourseIdea[] = [
  {
    title: 'Python for Machine Learning',
    category: 'Python · Machine learning',
    description:
      'A practical path from Python foundations to understanding a small learning system.',
    sourceTitle: 'Python - Building Machines Learning System.pdf',
  },
  {
    title: 'Artificial Intelligence, Step by Step',
    category: 'Artificial intelligence',
    description:
      'A proposed introduction to core AI ideas, experiments, and responsible evaluation.',
    sourceTitle: 'Guide __to Artificial __Intelligence.pdf',
  },
  {
    title: 'Living Worlds: AI for Games',
    category: 'AI · Game development',
    description:
      'An idea for exploring game agents and simulated life through small playable projects.',
    sourceTitle: 'AI and Artificial Life in Video Games.pdf',
  },
];
