# MIDRAPR

Medical Imaging Dataset Risk Assessment & Profile Registry  
*A community-driven hub for creating, sharing and reviewing risk profiles of medical-imaging datasets before they power AI.*

---

## Table of Contents

1. [Why MIDRAPR?](#why-midrapr)
2. [Project Structure](#project-structure)
3. [Deployment (Firebase Hosting)](#deployment-firebase-hosting)
4. [Contributing Guide](#contributing-guide)
5. [Code of Conduct](#code-of-conduct)
6. [License](#license)
7. [Acknowledgements & Contact](#acknowledgements--contact)

---

## Why MIDRAPR?

- **Trustworthy Data**  
  Even the most accurate algorithm fails if it is trained on biased or low-quality data. MIDRAPR helps surface those risks *before* publication or clinical use.
- **Shared Vocabulary**  
  Clinicians, data scientists, and regulators rarely speak the same “risk” language. MIDRAPR’s framework bridges that gap with a modality-, country-, and ethics-aware checklist.
- **Open Science**  
  All profiles and the framework itself are open licensed. Community review > gate-keeping.
- **Actionable Outputs**  
  Each completed checklist is turned into a scored “Risk Passport” you can cite or append to your dataset release or journal submission.

---

## Project Structure

```
midrapr/
├─ public/           # static assets (hero images, favicon…)
├─ src/
│  ├─ components/    # reusable UI components
│  ├─ pages/         # Landing.jsx, About.jsx, Datasets.jsx…
│  ├─ data/          # JSON risk frameworks, example profiles
│  ├─ styles/        # Tailwind config
│  └─ main.jsx       # entry point
├─ .github/
│  └─ workflows/     # CI configuration
├─ firebase.json     # Firebase Hosting config
└─ README.md         # ← you are here
```

---

## Deployment (Firebase Hosting)

1. Install the Firebase CLI:
   ```sh
   npm install -g firebase-tools
   ```
2. Log in and initialize (if not already done):
   ```sh
   firebase login
   firebase init hosting
   ```
3. Build and deploy:
   ```sh
   pnpm build
   firebase deploy --only hosting
   ```

---

## Contributing Guide

We ❤️ pull requests!

### 1. Issues & Discussion

- **Bugs / Feature Requests** → use GitHub Issues

### 2. Branch Workflow

- `main` is protected — create feature branches (`feat/...`, `fix/...`).
- Ensure `pnpm lint && pnpm test` passes before opening a PR.
- Follow conventional commits (`feat:`, `fix:`, `docs:`) for automatic changelogs.

### 3. Coding Standards

- **Style:** Prettier auto-format (`pnpm format`).
- **Lint:** ESLint (Airbnb + React). Warnings fail CI.
- **Types:** We aim to migrate to TypeScript; new files can be `.tsx`.
- **Accessibility:** Use semantic HTML, include `alt` text, ensure keyboard navigation.

### 4. Dataset Contributions

If you are contributing a risk profile:

1. Fork the repository.
2. Add a new JSON file under `src/data/profiles/` following `profile.schema.json`.
3. Include source citations (DOI / URL / PubMed ID) where applicable.
4. Open a PR titled `profile: <dataset name>`.

### 5. Community Values

We believe open science + diverse voices => safer AI.  
By contributing, you agree to follow our Code of Conduct.

---

## Code of Conduct

We abide by the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).  
Be kind, stay on topic, and zero tolerance for harassment.

---

## License

MIT © 2024–present Sujay Jain & MIDRAPR Contributors

---

## Acknowledgements & Contact

Questions? Open an issue on GitHub.  
Happy de-risking! 🚀
