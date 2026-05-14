# Contributing Guidelines

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature/bugfix

```bash
git checkout -b feature/feature-name
# or
git checkout -b bugfix/bug-name
```

## Development Setup

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Code Style

### Python (Backend)

- Follow PEP 8
- Use meaningful variable names
- Add docstrings to functions

```python
def create_post(title: str, content: str) -> Post:
    """Create a new blog post.

    Args:
        title: Post title
        content: Post content

    Returns:
        Created Post instance
    """
    post = Post(title=title, content=content)
    post.save()
    return post
```

### JavaScript/React (Frontend)

- Use functional components with hooks
- Use camelCase for variables
- Use PascalCase for components

```jsx
function BlogCard({ title, content, author }) {
  return (
    <div className="blog-card">
      <h3>{title}</h3>
      <p>{content}</p>
      <small>By {author}</small>
    </div>
  );
}
```

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add dark mode toggle to header
fix: Resolve search input border in dark mode
docs: Update architecture documentation
style: Format code with prettier
test: Add tests for blog creation
```

## Pull Request Process

1. Update documentation if needed
2. Test your changes thoroughly
3. Create a descriptive pull request
4. Link related issues
5. Wait for review approval

## Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Common Tasks

### Adding a New Feature

1. **Backend**:
   - Create/update models
   - Create/update serializers
   - Create/update views
   - Add tests

2. **Frontend**:
   - Create components
   - Update routing if needed
   - Add services/API calls
   - Style components

### Database Migrations

After model changes:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Issues and Discussions

- Use GitHub Issues for bugs
- Use Discussions for feature requests
- Be descriptive and include reproduction steps for bugs

## Code Review Guidelines

When reviewing code:

- Check for code quality
- Ensure adherence to style guidelines
- Verify tests pass
- Check documentation

## Questions?

Feel free to open an issue or start a discussion!
