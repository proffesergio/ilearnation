export const STARTER = `export default function Welcome() {
  return <h1>Hello, learner!</h1>;
}`;
export const HINTS = [
  'Change the text between <h1> and </h1>. Keep the component structure.',
  'Describe learning through building. Your heading should include the word “building”.',
  'Try a short sentence about what you do to learn, then run the code again.',
];

// A deliberately small JSX grammar. No eval, Function, VM, iframe scripts or host execution.
export function checkExercise(source) {
  const failure = (message) => ({ runnable: false, passed: false, heading: null, message });
  if (typeof source !== 'string' || source.length > 8192)
    return failure('Use a component under 8 KB.');
  const match = source.match(
    /^\s*export\s+default\s+function\s+Welcome\s*\(\s*\)\s*\{\s*return([ \t]*(\()?\s*)<h1>([^<>{}]{1,240})<\/h1>\s*(\))?\s*;?\s*\}\s*$/u,
  );
  if (!match)
    return failure(
      'This first checkpoint accepts Welcome() returning one text-only <h1>. Expressions, imports, attributes, and scripts are outside this exercise.',
    );
  if (Boolean(match[2]) !== Boolean(match[4]) || (!match[2] && /[\r\n]/.test(match[1])))
    return failure(
      'Pair the return parentheses and keep an unparenthesized heading on the same line as return.',
    );
  const heading = match[3].trim();
  if (!heading) return failure('Give the heading some readable text.');
  const passed = /\bbuilding\b/i.test(heading) && heading.length >= 12;
  return {
    runnable: true,
    passed,
    heading,
    message: passed
      ? 'Checkpoint passed. Your component now describes learning by building.'
      : 'Your heading renders. Next, write a sentence of at least 12 characters that includes “building”.',
  };
}

export function parseProgress(
  raw,
  chapterIds,
  identity = { courseId: 'full-stack-modern-react-nextjs', courseVersion: '0.1.0' },
) {
  try {
    if (typeof raw !== 'string' || raw.length > 8192) return null;
    const value = JSON.parse(raw);
    const fields = ['schemaVersion', 'courseId', 'courseVersion', 'completed', 'exercisePassed'];
    if (
      !value ||
      typeof value !== 'object' ||
      Object.keys(value).some((key) => !fields.includes(key))
    )
      return null;
    if (
      value.schemaVersion !== 1 ||
      value.courseId !== identity.courseId ||
      value.courseVersion !== identity.courseVersion
    )
      return null;
    if (
      !Array.isArray(value.completed) ||
      value.completed.length > chapterIds.length ||
      typeof value.exercisePassed !== 'boolean'
    )
      return null;
    if (
      value.completed.some((id) => typeof id !== 'string' || !chapterIds.includes(id)) ||
      new Set(value.completed).size !== value.completed.length
    )
      return null;
    return value;
  } catch {
    return null;
  }
}
