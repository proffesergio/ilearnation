# PDF course sequence

Owner confirmed adaptation and publication rights for all four supplied PDFs
on 2026-10-16. The private references remain excluded from Git and deployments.
Rights do not mean a supplied book is public domain or that a planned course
already has playable lessons.

The current focus is the complete React course, followed by one whole course at
a time. Each later course needs its own versioned manifest, original chapters in
the supplied order, dated current primary references, runnable deterministic
examples, exercises/hints/recovery, validation, conclusion, and course repository.
Do not thinly summarize old books and label the result a complete modern course.

## 1. React: authored edition0.3.0

Daniel Bugl, Modern Full-Stack React Projects (Packt2024).
Twenty exact chapter titles/order are in
[the manifest](../../courses/full-stack-modern-react-nextjs/course.json).
The original Field Notes project contains Express/Mongoose/Jest, React/TanStack,
Docker guidance, JWT, SSR, SEO, browser tests, statistics/Victory, GraphQL/Apollo,
Socket.IO persistence and Next.js. Chapter20 concludes with capstone evidence.

## 2. Python machine learning: next full authoring pass

Willi Richert and Luis Pedro Coelho, Building Machine Learning Systems with Python,
Packt2013. The edition is old; use it for topic order, then research current
Python, NumPy, SciPy, scikit-learn and data-license practices. Do not reproduce
obsolete APIs or imply their examples were tested against current packages.

1. Getting Started with Python Machine Learning
2. Learning How to Classify with Real-world Examples
3. Clustering – Finding Related Posts
4. Topic Modeling
5. Classification – Detecting Poor Answers
6. Classification II – Sentiment Analysis
7. Regression – Recommendations
8. Regression – Recommendations Improved
9. Classification III – Music Genre Classification
10. Computer Vision – Pattern Recognition
11. Dimensionality Reduction
12. Big(ger) Data

Proposed repo: proffesergio/python-machine-learning-systems.
Use seeded local synthetic or properly licensed datasets, train/test separation,
leakage checks, baseline comparisons, CPU-friendly scripts, dataset/model cards
and a final reproducibility report. Do not require downloading copyrighted music.

## 3. AI adoption: subsequent complete course

Andrew Burgess, The Executive Guide to Artificial Intelligence: How to identify
and implement applications for AI in your organization. DOI
https://doi.org/10.1007/978-3-319-63820-1. Use original organizational scenarios,
measurable experiments, governance and current primary references.

1. Don’t Believe the Hype
2. Why Now?
3. AI Capabilities Framework
4. Associated Technologies
5. AI in Action
6. Starting an AI Journey
7. AI Prototyping
8. What Could Possibly Go Wrong?
9. Industrialising AI
10. Where Next for AI?

Proposed repo: proffesergio/executive-guide-ai. Build a local evaluation worksheet,
risk register and small key-free prototype. Distinguish modern generative models
from the book's original technology context. No fabricated ROI or legal claims.

## 4. Game AI and artificial life: subsequent complete course

Guy W. Lecky-Thompson, AI and Artificial Life in Video Games, Course Technology /
Cengage2008. Preserve its ten-chapter order while using original deterministic
simulations with seeded randomness and accessible visual/text outputs.

1. Introduction
2. Using Artificial Intelligence in Video Games
3. Uses for Artificial Life in Video Games
4. The A-Life Programming Paradigm
5. Building Blocks
6. The Power of Emergent Behavior
7. Testing with Artificial Life
8. Several A-Life Examples
9. Multiplayer AI and A-Life
10. The Application of A-Life Outside the Lab

Proposed repo: proffesergio/ai-artificial-life-games.
Use original finite-state, steering/flocking, evolutionary and multiplayer
examples. Include fixed-step simulation, pause/replay, reduced motion, reproducible
tests and failure analysis. Do not claim toy agents are generally intelligent.

## Shared release gate

Author and verify one whole course before creating its playable platform entry.
Record actual project test results and optional unrun integrations separately.
Give each course a public overview, several free preview chapters, primary
references and the exact repository link. Keep account progress version-scoped.
[Owner setup and publishing instructions](../runbooks/course-publishing-and-google.md)
cover CLI publication and remaining Google/manual work.
