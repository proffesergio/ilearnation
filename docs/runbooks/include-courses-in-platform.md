# Course content in both repositories

Updated: 2026-10-16. The owner wants the same reviewed course content in the
platform repository and the dedicated course repository. There is one local course
working directory: `courses/full-stack-modern-react-nextjs/`.

## Current layout

- Platform `README.md`: overview of iLearnNation and the website.
- `courses/README.md`: a catalog page, not an independent repository.
- `courses/full-stack-modern-react-nextjs/README.md`: the actual course README;
  this becomes the root README of the dedicated course repository.
- `courses/full-stack-modern-react-nextjs/chapters/` and `assets/`: included content.
- `.local-data/course-git/full-stack-modern-react-nextjs.git`: preserved independent
  course history and remote configuration, ignored by parent Git/Vercel.

The owner has already replaced the parent 160000 Git pointer with individual
100644 file entries and moved the nested metadata to that local archive. No extra
checkout is required. **Do not repeat the conversion or initialize another nested
repository.** The parent index contains the normal files; the inclusion still needs
to be committed. The latest README/assets edits also need to be restaged.

The parent's current HEAD is `9bbab18`; the independent course HEAD is `a21819c`.
Each local `main` tracking ref matched its `origin/main` during inspection. These
are local observations; remote contents/CI/deployment were not queried successfully.

## Review and commit platform changes

From the platform root, in the owner's writable terminal:

```sh
git status --short --branch
git add -- README.md courses .gitignore .vercelignore CONTRIBUTING.md TODO.md CHANGELOG.md docs
git ls-files --stage -- courses/
git diff --cached --stat
git diff --cached --submodule=short
```

Verify the course files have normal file modes and no 160000 directory entry.
The diff includes removing the old pointer and adding the actual files; it does
not delete working lessons. Review all staged content, then commit:

```sh
git commit -m "docs: expand learning guides and include course content"
```

Push through the intended approved parent branch separately; do not force-push or
change origins. The agent session cannot write the parent Git index, so these
staging/commit operations must run in the owner's terminal. No new push is performed
by the documentation changes.

## Review the dedicated course changes separately

The archived Git repository still uses the same course working directory. From
the platform root, use explicit options for course-specific operations:

```sh
git --git-dir=.local-data/course-git/full-stack-modern-react-nextjs.git --work-tree=courses/full-stack-modern-react-nextjs status --short --branch
git --git-dir=.local-data/course-git/full-stack-modern-react-nextjs.git --work-tree=courses/full-stack-modern-react-nextjs diff -- README.md assets
```

For the current course README/banner update, after review:

```sh
git --git-dir=.local-data/course-git/full-stack-modern-react-nextjs.git --work-tree=courses/full-stack-modern-react-nextjs add -- README.md assets/README.md assets/course-banner.svg assets/community-thanks.svg
git --git-dir=.local-data/course-git/full-stack-modern-react-nextjs.git --work-tree=courses/full-stack-modern-react-nextjs diff --cached --stat
git --git-dir=.local-data/course-git/full-stack-modern-react-nextjs.git --work-tree=courses/full-stack-modern-react-nextjs commit -m "docs(course): expand roadmap and welcome guide"
```

Use the same `--git-dir` and `--work-tree` options for approved course pushes and
record the new SHA. Without those options, `git -C` inside the course now selects
the parent platform repository. A commit in either repository does not update the
other. Do not move the archive back into the working directory before staging;
that would create another embedded Git pointer.

The dedicated course remains the reviewed curriculum source per ADR 0001. Bundle
reviewed revisions in the parent and record consumed commit SHAs; there is no
automatic two-way sync. Never rewrite a published course version in place.

## Verify a complete clone

After the parent inclusion commit, a clean platform clone should contain
`courses/full-stack-modern-react-nextjs/course.json` and all eight chapters without
submodule initialization. Check with `npm run course:validate`, `npm test`, and
`python3 scripts/check_repository.py`. The archived local metadata is not needed
by a fresh platform clone. Hosted deployment verification remains separate.
