# Blog Project

A full-stack blog application built with Django REST Framework backend and React frontend.

## Project Structure

```
blog-project/
├── backend/                 # Django backend
│   ├── apps/               # Django applications
│   │   ├── blog/          # Blog app
│   │   └── polls/         # Polls app
│   ├── config/            # Django project settings
│   ├── media/             # User uploaded media
│   ├── static/            # Static files
│   ├── db.sqlite3         # SQLite database
│   ├── manage.py          # Django management script
│   └── requirements.txt   # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── assets/        # Static assets (CSS, images)
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Public assets
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Vite configuration
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
├── .gitignore             # Git ignore rules
├── package.json           # Monorepo configuration
└── README.md              # This file
```

## Features

- User authentication and authorization
- Blog post creation and management
- Comment system
- Dark mode support
- Responsive design
- RESTful API

## Tech Stack

### Backend

- Django 6.0
- Django REST Framework
- SQLite (development) / PostgreSQL (production)
- JWT authentication

### Frontend

- React 18
- Vite
- React Router
- Axios
- Bootstrap
- FontAwesome icons

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blog-project
```

2. Install dependencies:

```bash
npm run install:all
```

Or install separately:

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

3. Set up the database:

```bash
cd backend
python manage.py migrate
```

4. Create a superuser:

```bash
python manage.py createsuperuser
```

5. Start the development servers:

```bash
npm run dev
```

This will start both the Django backend (http://localhost:8000) and React frontend (http://localhost:5173).

## Development

### Backend Development

```bash
cd backend
python manage.py runserver
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Building for Production

```bash
npm run build
```

## API Documentation

The API endpoints are documented at `/api/docs/` when running the Django server.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
