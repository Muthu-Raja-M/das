# Contributing to Blue Connect

We welcome contributions to the Blue Connect project. Please review these guidelines to ensure a smooth development workflow.

---

## 1. Code of Conduct

Help us maintain a collaborative, respectful, and productive development environment.

---

## 2. Development Workflow & Branching Policy

We use a standard branching model. All development changes must go through pull requests.

```text
  main (production)
   ▲
   │ (Pull Request & Code Review)
  develop (integration)
   ▲
   ├─► feature/authentication-fix
   └─► hotfix/cors-patch
```

* **`main`**: Represents the current stable production code.
* **`develop`**: Where active integration happens.
* **Feature Branches (`feature/`)**: Used for new features or refactoring (e.g. `feature/jwt-refresh-fix`).
* **Bugfix Branches (`bugfix/` or `hotfix/`)**: Used for critical production patches.

### Lifecycle of a Contribution
1. Fork or clone the repository and navigate to the project root.
2. Create a branch off `develop` (or `main` if `develop` is absent):
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Implement your changes. Do not bundle unrelated modifications.

---

## 3. Coding Style Standards

### Python (Backend)
* Follow the standard **PEP 8** style guidelines.
* Keep imports grouped logically:
  1. Standard library imports.
  2. Third-party imports (Django, DRF).
  3. Local app imports (`apps.*`).
* Document all views and helper functions using docstrings.

### JavaScript (React Frontend)
* Code format must follow the Vite/ESLint rules.
* Check for code issues and format inconsistencies before committing:
  ```bash
  cd ui
  npm run lint
  ```

---

## 4. Git Commit Guidelines

We recommend using clear, descriptive commit messages.

```text
<type>(<scope>): <short description>

[optional body]
```

### Supported Commit Types
* `feat`: A new feature.
* `fix`: A bug fix.
* `docs`: Documentation updates.
* `style`: Formatting changes that do not affect code logic (white-space, formatting, semi-colons).
* `refactor`: Code changes that neither fix a bug nor add a feature.
* `test`: Adding missing tests or correcting existing tests.

### Examples
* `feat(auth): integrate simplejwt login views`
* `docs(readme): update setup and configuration checklist`
* `fix(verify): resolve unauthenticated access to approval endpoint`

---

## 5. Pull Requests (PR) Checklist

Before submitting a PR, make sure you complete these steps:
* [ ] Run frontend linter tests (`npm run lint`).
* [ ] Verify the backend runs without errors using `python manage.py check`.
* [ ] Ensure all local database migrations are generated and committed.
* [ ] Write clear descriptions in the PR summary detailing the changes, root causes, and testing steps.
