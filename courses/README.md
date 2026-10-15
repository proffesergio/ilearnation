# Find your next chapter

This file is the platform’s course catalog, not an independent repository.
The connected course lives in `full-stack-modern-react-nextjs/` and has its own
[course README](full-stack-modern-react-nextjs/README.md).

Welcome to the iLearnNation course library. Start with a getting-started guide,
check the prerequisites, and work through one small learning loop at a time.

| Course | Start here | Current scope |
| --- | --- | --- |
| Full-Stack Modern React and Next.js Application Development | [Getting started](full-stack-modern-react-nextjs/getting-started.md) · [Course overview](full-stack-modern-react-nextjs/README.md) | Original draft 0.1.0; eight chapters, runnable Node checkpoints, and a first interactive website exercise |

## Choose a route

1. Read the guide before installing tools; it describes prerequisites and expectations.
2. Begin with [Foundations](full-stack-modern-react-nextjs/chapters/foundations.md).
3. Run a checkpoint, make a change, check it, and explain what happened.
4. Use the progressive hints and reflection prompts, then build toward the capstone.

The chapter Markdown works on GitHub. The website adds the lesson player and
bounded first JSX exercise; follow the [platform setup](../README.md#run-the-learning-studio).
Framework project extensions require the environment named in each lesson.

## For course contributors

Keep actual course files in this repository so a normal clone includes the lessons.
The dedicated React/Next.js repository remains another learner entry point;
updates between repositories require reviewed commits, not automatic two-way sync.
See [ADR 0001](../docs/adr/0001-course-source-and-admin-boundaries.md) and the
[inclusion guide](../docs/runbooks/include-courses-in-platform.md).

Every course needs a versioned manifest, objectives, prerequisites, effort,
exercises, hints, validation, accessibility notes, reflection, and dated references.
Validate from the platform root with `npm run course:validate` and `npm test`.
Read [Contributing](../CONTRIBUTING.md) before changing content. Keep PDFs, learner
data, and secrets out of the library. No course reuse license has been selected.
