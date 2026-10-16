export type CourseIdea = {
  title: string;
  category: string;
  description: string;
  sourceTitle: string;
};

// Rights and chapter inventories are confirmed; these courses are not authored yet.
export const courseIdeas: CourseIdea[] = [
  {
    title: 'Python for Machine Learning',
    category: 'Python · Machine learning',
    description:
      'A practical path from Python foundations to understanding a small learning system.',
    sourceTitle: 'Building Machine Learning Systems with Python — Richert and Coelho',
  },
  {
    title: 'The Executive Guide to Artificial Intelligence',
    category: 'AI adoption · Evaluation',
    description:
      'A planned course on identifying useful applications, prototyping, and evaluating organizational AI responsibly.',
    sourceTitle: 'The Executive Guide to Artificial Intelligence — Andrew Burgess',
  },
  {
    title: 'Living Worlds: AI for Games',
    category: 'AI · Game development',
    description:
      'An idea for exploring game agents and simulated life through small playable projects.',
    sourceTitle: 'AI and Artificial Life in Video Games — Guy W. Lecky-Thompson',
  },
];
