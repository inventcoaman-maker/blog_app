# Project Architecture

## Backend Structure

### Django Project Settings (config/)

- `config/mySite/settings.py` - Main Django settings
- `config/mySite/urls.py` - Main URL configuration
- `config/mySite/wsgi.py` - WSGI application
- `config/mySite/asgi.py` - ASGI application

### Django Applications (apps/)

#### Blog App (`apps/blog/`)

- **models.py** - Database models (User, Post, Comment, Like, etc.)
- **views.py** - View logic for blog pages
- **urls.py** - URL routing for blog app
- **serializers.py** - DRF serializers for API
- **admin.py** - Django admin configuration
- **forms.py** - Django forms for templates
- **migrations/** - Database migrations
- **templates/** - HTML templates
- **static/** - CSS and JavaScript for blog

#### Polls App (`apps/polls/`)

- Similar structure for polls functionality

#### API App (`apps/API/`)

- **views.py** - REST API views
- **serializers.py** - Data serialization
- **urls.py** - API endpoint routing
- **pagination.py** - Pagination configuration

## Frontend Structure

### Components (`src/components/`)

Reusable React components:

- `auth/` - Authentication components (Login, Signup)
- `header/` - Header component with navigation
- `post/` - Post-related components
- `context/` - React Context providers

### Pages (`src/pages/`)

Page-level components:

- Home page
- Profile page
- Post detail page
- Post edit page

### Services (`src/services/`)

API integration:

- `api.js` - Centralized API client using Axios

### Utilities (`src/utils/`)

Helper functions:

- `imageUrl.js` - Image URL resolution

### Assets (`src/assets/`)

Static files:

- CSS files (index.css, App.css, Header.css, etc.)
- Images and icons

## Configuration Files

- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `docker-compose.yml` - Docker orchestration
- `Dockerfile` - Backend Docker image
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies (monorepo config)

## Directory Tree

```
blog-project/
├── backend/
│   ├── apps/
│   │   ├── API/
│   │   ├── blog/
│   │   └── polls/
│   ├── config/
│   │   └── mySite/
│   ├── media/
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
├── docs/
├── scripts/
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

## Best Practices

1. **Modular Components** - Keep components small and focused
2. **Centralized API** - All API calls through services
3. **Environment Variables** - Use .env for configuration
4. **Code Organization** - Logical folder structure
5. **Naming Conventions** - Clear, descriptive names
6. **Comments** - Document complex logic
7. **Error Handling** - Proper error handling throughout
8. **Security** - Never commit secrets, use .env
