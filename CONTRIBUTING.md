# Contributing to Cyber Mart 2077

Thank you for your interest in contributing to Cyber Mart 2077! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/market-10.2.git
   cd market-10.2
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/luxurystores888-afk/market-10.2.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up your environment**:
   ```bash
   cp .env.example .env
   # Configure your .env file
   npm run db:push
   ```

## 💻 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests
npm test

# Test the application manually
npm run dev:all
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add user profile page"
```

**Commit message format:**
```
<type>: <description>

[optional body]
[optional footer]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add product search functionality
fix: resolve cart calculation bug
docs: update API documentation
refactor: simplify authentication logic
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots (if applicable)
- List of changes made

## 📝 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use functional components and hooks in React
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable names
- Keep functions small and focused
- Add JSDoc comments for complex functions

**Example:**
```typescript
/**
 * Calculates the total price of cart items including tax
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @returns Total price including tax
 */
export function calculateTotal(items: CartItem[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * (1 + taxRate);
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Keep custom CSS minimal
- Use CSS variables for theming

### File Organization

- One component per file
- Group related files in folders
- Use index files for exports
- Keep file names descriptive and lowercase

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing issues to avoid duplicates
2. Test on the latest version
3. Gather relevant information

### Bug Report Template

```markdown
**Description:**
A clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g., Windows 11, macOS 14]
- Browser: [e.g., Chrome 120]
- Node.js version: [e.g., 20.10.0]

**Screenshots:**
If applicable, add screenshots

**Additional Context:**
Any other relevant information
```

## 💡 Feature Requests

We welcome feature suggestions! Please:

1. Check if the feature already exists
2. Search existing feature requests
3. Provide clear use cases
4. Explain the benefit to users

### Feature Request Template

```markdown
**Feature Description:**
Clear description of the feature

**Use Case:**
Why this feature is needed

**Proposed Solution:**
How you envision it working

**Alternatives:**
Any alternative solutions you've considered

**Additional Context:**
Mockups, examples, or references
```

## 🔍 Code Review Process

1. All submissions require review
2. Reviewers may request changes
3. Address feedback promptly
4. Be open to suggestions
5. Once approved, maintainers will merge

## ✅ Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] PR description is clear

## 🧪 Testing Guidelines

- Write tests for new features
- Maintain test coverage above 80%
- Test edge cases
- Use descriptive test names

**Example:**
```typescript
describe('calculateTotal', () => {
  it('should calculate total with tax correctly', () => {
    const items = [{ price: 100, quantity: 2 }];
    const total = calculateTotal(items, 0.1);
    expect(total).toBe(220);
  });

  it('should handle empty cart', () => {
    const total = calculateTotal([], 0.1);
    expect(total).toBe(0);
  });
});
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🙋 Questions?

- Open a GitHub Discussion
- Join our Discord community
- Email us at dev@cybermart2077.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Cyber Mart 2077! 🚀

