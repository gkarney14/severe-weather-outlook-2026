# Contributing to Severe Weather Outlook

Thank you for your interest in contributing! This document provides guidelines for participating in the project.

## Code of Conduct

We are committed to maintaining a respectful community. All contributors are expected to:
- Be respectful and inclusive
- Welcome feedback and criticism
- Focus on constructive communication
- Respect the safety and well-being of all community members

## How to Contribute

### 1. Reporting Issues

Found a bug? Have a suggestion? Please open an issue on GitHub!

**Before opening an issue, check if it already exists.**

When reporting:
- Use a clear, descriptive title
- Include a detailed description of the issue
- Provide steps to reproduce (for bugs)
- Include screenshots/recordings if relevant
- Specify browser and OS versions
- Include any error messages from console

**Issue Template**:
```markdown
## Description
[Clear description of the issue]

## Steps to Reproduce
1. Navigate to...
2. Click on...
3. Observe...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots/Error Messages
[Relevant errors or visuals]

## Environment
- Browser: [Chrome/Firefox/Safari/Edge]
- OS: [Windows/macOS/Linux]
- Version: [Browser version]
```

### 2. Feature Requests

Have an idea to improve the application?

**Process**:
1. Check existing discussions/issues to avoid duplicates
2. Open an issue with the "enhancement" label
3. Clearly describe the feature and use cases
4. Include mockups/examples if helpful

**Template**:
```markdown
## Feature Description
[Clear description of the feature]

## Problem It Solves
[What problem does this address?]

## Use Cases
- [Use case 1]
- [Use case 2]

## Proposed Implementation
[How you imagine this working]

## Alternatives Considered
[Other approaches that were considered]
```

### 3. Code Contributions

#### Setting Up Development Environment

1. **Fork the repository** on GitHub
   ```bash
   # Go to GitHub and click "Fork" button
   ```

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/YOUR-USERNAME/severe-weather-outlook.git
   cd severe-weather-outlook
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

4. **Make your changes**
   - Edit `index.html` for HTML/CSS/JavaScript changes
   - Update documentation as needed
   - Test thoroughly in multiple browsers

5. **Test Your Changes**
   ```bash
   # Start a local server
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Clear description of changes (fixes #123)"
   ```

   **Commit message guidelines**:
   - Use present tense: "Add feature" not "Added feature"
   - Reference issues: "fixes #123" or "closes #456"
   - Keep messages concise but descriptive
   - Examples:
     - `Add tornado threat display (fixes #45)`
     - `Improve mobile responsiveness (fixes #32)`
     - `Fix: API rate limit handling (fixes #78)`
     - `Docs: Update API reference`

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Go to GitHub and click "Compare & Pull Request"
   - Fill in the PR template (see below)
   - Request reviews from maintainers
   - Respond to feedback and make requested changes

#### Pull Request Template

```markdown
## Description
[Brief description of what this PR does]

## Related Issue
Fixes #[issue_number]

## Changes Made
- [Change 1]
- [Change 2]
- [Change 3]

## Testing
- [x] Tested in Chrome
- [x] Tested in Firefox
- [x] Tested on mobile
- [ ] Added/updated tests

## Screenshots/Demo
[If applicable, include screenshots or GIF showing the changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation has been updated
- [ ] No new warnings/errors in console
- [ ] Changes are backward compatible
- [ ] Commit messages are clear and descriptive
```

### 4. Documentation Contributions

Found a typo or want to improve docs?

- Update relevant `.md` files
- Follow existing style and formatting
- Test markdown formatting renders correctly
- Commit with message like "Docs: [what was changed]"

### 5. Code Review Process

All contributions go through code review:

1. **Automated checks** run first (linting, etc.)
2. **Maintainers review** code and suggest changes
3. **Discussion** happens in comments
4. **Revisions** are made to the PR
5. **Approval** from at least one maintainer required
6. **Merge** to main branch

## Development Guidelines

### Code Style

- **JavaScript**: 
  - Use clear, descriptive variable names
  - Comment complex logic
  - Follow existing patterns in the codebase
  - Max line length: 100 characters

- **CSS**:
  - Use CSS variables defined at `:root`
  - Follow mobile-first responsive design
  - Group related rules together
  - Use meaningful class names

- **HTML**:
  - Use semantic HTML5 elements
  - Include `alt` text for images
  - Use proper heading hierarchy
  - Include ARIA labels where appropriate

### Best Practices

- **Keep it simple**: Don't over-engineer solutions
- **Backward compatible**: Don't break existing functionality
- **Performance**: Consider impact on load time/responsiveness
- **Accessibility**: Test with keyboard navigation and screen readers
- **Cross-browser**: Test in Chrome, Firefox, Safari, Edge
- **Mobile-first**: Design for mobile, scale up
- **No dependencies**: Maintain zero-dependency philosophy when possible

### Testing

Test your changes:

1. **Functional testing**: Does the feature work as intended?
2. **Browser testing**: Works in Chrome, Firefox, Safari, Edge?
3. **Mobile testing**: Works on phones/tablets?
4. **Accessibility testing**: Keyboard navigable? Screen reader compatible?
5. **Edge cases**: Test with invalid input, network errors, etc.

### Documentation

Update documentation for:
- New features
- API changes
- Breaking changes
- Configuration options
- Installation/setup changes

## Project Structure

```
severe-weather-outlook/
├── index.html           # Main application (HTML + CSS + JS)
├── README.md            # Project overview
├── LICENSE              # MIT License
├── .gitignore           # Git ignore rules
├── CONTRIBUTING.md      # This file
├── API_REFERENCE.md     # API documentation
└── docs/
    ├── setup-guide.md   # Setup instructions
    ├── architecture.md  # Technical details
    └── deployment.md    # Deployment guide
```

## Git Workflow

### Branch Naming
- `feature/[description]` - New features
- `fix/[description]` - Bug fixes
- `docs/[description]` - Documentation updates
- `refactor/[description]` - Code refactoring
- `perf/[description]` - Performance improvements

### Commit Messages
- Use present tense
- Reference issues/PRs
- Keep clear and concise
- Examples:
  ```
  Add real-time alert notifications (fixes #123)
  Improve forecast loading performance
  Fix: Handle missing NOAA data gracefully
  Refactor: Simplify threat analysis logic
  Docs: Add deployment instructions
  ```

### Rebasing
We prefer a linear history. Before merging:
- Rebase on latest main: `git rebase origin/main`
- Squash related commits if appropriate
- Force push if needed: `git push --force-with-lease`

## Review Expectations

### As a Contributor
- Respond to review comments promptly
- Be open to constructive feedback
- Ask questions if you don't understand feedback
- Make requested changes in new commits
- Don't take critical feedback personally

### As a Reviewer
- Be constructive and respectful
- Ask clarifying questions
- Suggest improvements, not just criticisms
- Approve when acceptable
- Be timely with reviews

## Release Process

Releases follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

Process:
1. Update version in relevant files
2. Update CHANGELOG
3. Create GitHub release with notes
4. Deploy to GitHub Pages

## Common Tasks

### Adding a New Feature

1. Create issue for discussion
2. Create feature branch from main
3. Implement feature with tests
4. Update documentation
5. Submit PR with clear description
6. Address review feedback
7. Merge and deploy

### Fixing a Bug

1. Create issue documenting the bug
2. Create fix branch: `git checkout -b fix/issue-number`
3. Add test case that reproduces bug
4. Fix the bug
5. Verify fix and test passes
6. Submit PR referencing issue
7. After merge, verify fix in production

### Updating Documentation

1. Create branch: `git checkout -b docs/what-changed`
2. Make documentation updates
3. Review for clarity and accuracy
4. Submit PR
5. Merge after approval

## Staying Updated

- Watch the repository for updates
- Subscribe to release notifications
- Follow issues that interest you
- Participate in discussions

## Getting Help

- **Questions**: Open a discussion or issue
- **Problems**: Check existing issues first
- **Documentation**: See README and docs/ folder
- **Community**: Engage respectfully with other contributors

## Recognition

Contributors are recognized:
- In releases notes for PRs
- In GitHub contributors page
- In project documentation

Thank you for contributing! 🎉

---

*Last updated: May 2026*
