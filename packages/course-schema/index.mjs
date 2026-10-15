/** Version 1 JSON manifest validation. It never loads files, fetches URLs, or runs code. */
export function validateCourse(input) {
  const errors = [];
  const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const text = (value, at, max = 300) => {
    if (
      typeof value !== 'string' ||
      value.trim().length === 0 ||
      value.length > max ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
    )
      errors.push(`${at}: expected nonempty text up to ${max} characters`);
  };
  const keys = (value, allowed, at) => {
    for (const key of Object.keys(value))
      if (!allowed.includes(key)) errors.push(`${at}.${key}: unknown field`);
  };
  const list = (value, at, min = 0, max = 50) => {
    if (!Array.isArray(value) || value.length < min || value.length > max) {
      errors.push(`${at}: expected an array with ${min}-${max} entries`);
      return [];
    }
    return value;
  };
  const strings = (value, at, min = 0) =>
    list(value, at, min).forEach((entry, index) => text(entry, `${at}[${index}]`, 500));
  const id = (value, at) => {
    if (
      typeof value !== 'string' ||
      value.length > 100 ||
      !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value)
    )
      errors.push(`${at}: expected a kebab-case identifier`);
  };
  if (!object(input)) return { success: false, errors: ['course: expected an object'] };
  keys(
    input,
    [
      'schemaVersion',
      'id',
      'version',
      'status',
      'title',
      'description',
      'locale',
      'level',
      'tags',
      'prerequisites',
      'learningOutcomes',
      'accessibilityNotes',
      'chapters',
      'completion',
      'references',
    ],
    'course',
  );
  if (input.schemaVersion !== 1) errors.push('schemaVersion: only version 1 is supported');
  id(input.id, 'id');
  if (
    typeof input.version !== 'string' ||
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(input.version) ||
    input.version.length > 30
  )
    errors.push('version: expected major.minor.patch');
  if (!['draft', 'review', 'published', 'archived'].includes(input.status))
    errors.push('status: expected draft, review, published, or archived');
  text(input.title, 'title');
  text(input.description, 'description', 2000);
  if (
    typeof input.locale !== 'string' ||
    !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(input.locale) ||
    input.locale.length > 35
  )
    errors.push('locale: expected a language tag');
  text(input.level, 'level', 100);
  strings(input.tags, 'tags', 1);
  strings(input.prerequisites, 'prerequisites');
  strings(input.learningOutcomes, 'learningOutcomes', 1);
  strings(input.accessibilityNotes, 'accessibilityNotes', 1);
  const chapters = list(input.chapters, 'chapters', 1, 100);
  const ids = new Set();
  for (const [index, chapter] of chapters.entries()) {
    const at = `chapters[${index}]`;
    if (!object(chapter)) {
      errors.push(`${at}: expected an object`);
      continue;
    }
    keys(
      chapter,
      [
        'id',
        'title',
        'summary',
        'estimatedMinutes',
        'objectives',
        'prerequisites',
        'lessonPath',
        'exerciseId',
      ],
      at,
    );
    id(chapter.id, `${at}.id`);
    if (ids.has(chapter.id)) errors.push(`${at}.id: duplicate chapter`);
    ids.add(chapter.id);
    text(chapter.title, `${at}.title`);
    text(chapter.summary, `${at}.summary`, 1000);
    if (
      !Number.isInteger(chapter.estimatedMinutes) ||
      chapter.estimatedMinutes < 1 ||
      chapter.estimatedMinutes > 1440
    )
      errors.push(`${at}.estimatedMinutes: expected integer 1-1440`);
    strings(chapter.objectives, `${at}.objectives`, 1);
    strings(chapter.prerequisites, `${at}.prerequisites`);
    if (
      typeof chapter.lessonPath !== 'string' ||
      chapter.lessonPath !== `chapters/${chapter.id}.md` ||
      !/^chapters\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.md$/.test(chapter.lessonPath)
    )
      errors.push(`${at}.lessonPath: expected chapters/<chapter-id>.md`);
    if (chapter.exerciseId !== undefined) id(chapter.exerciseId, `${at}.exerciseId`);
  }
  if (!object(input.completion)) errors.push('completion: expected an object');
  else {
    keys(input.completion, ['requiredChapters', 'capstone', 'rule'], 'completion');
    const required = list(input.completion.requiredChapters, 'completion.requiredChapters', 1, 100);
    for (const chapter of required)
      if (!ids.has(chapter)) errors.push('completion.requiredChapters: unknown chapter');
    if (new Set(required).size !== required.length)
      errors.push('completion.requiredChapters: duplicates');
    if (!ids.has(input.completion.capstone)) errors.push('completion.capstone: unknown chapter');
    text(input.completion.rule, 'completion.rule', 1000);
  }
  const references = list(input.references, 'references', 1, 100);
  for (const [index, reference] of references.entries()) {
    const at = `references[${index}]`;
    if (!object(reference)) {
      errors.push(`${at}: expected an object`);
      continue;
    }
    keys(reference, ['title', 'author', 'url', 'status', 'accessedOn', 'chapters'], at);
    for (const field of ['title', 'author', 'status'])
      text(reference[field], `${at}.${field}`, 500);
    try {
      if (typeof reference.url !== 'string') throw new Error();
      const url = new URL(reference.url);
      if (url.protocol !== 'https:' || url.username || url.password || reference.url.length > 2000)
        throw new Error();
    } catch {
      errors.push(`${at}.url: expected an HTTPS URL without credentials`);
    }
    if (
      typeof reference.accessedOn !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(reference.accessedOn) ||
      Number.isNaN(Date.parse(reference.accessedOn)) ||
      new Date(reference.accessedOn).toISOString().slice(0, 10) !== reference.accessedOn
    )
      errors.push(`${at}.accessedOn: expected a calendar date`);
    for (const chapter of list(reference.chapters, `${at}.chapters`, 1, 100))
      if (!ids.has(chapter)) errors.push(`${at}.chapters: unknown chapter`);
  }
  return errors.length ? { success: false, errors } : { success: true, data: input };
}
