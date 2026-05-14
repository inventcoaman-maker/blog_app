# API Documentation

## Base URL

```
http://localhost:8000/api
```

## Authentication

All API endpoints (except auth) require JWT token in header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Login

```
POST /auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response: 200
{
  "access": "token...",
  "refresh": "token..."
}
```

#### Register

```
POST /auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "username": "username"
}

Response: 201
{
  "id": 1,
  "email": "user@example.com",
  "username": "username"
}
```

### Blog Posts

#### List Posts

```
GET /posts/
Query Parameters:
  - page: int
  - category: str
  - author: str
  - search: str

Response: 200
{
  "count": 10,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Post Title",
      "content": "Post content...",
      "author": "username",
      "created_at": "2024-01-01T00:00:00Z",
      "category": "Technology"
    }
  ]
}
```

#### Get Post

```
GET /posts/{id}/

Response: 200
{
  "id": 1,
  "title": "Post Title",
  "content": "Post content...",
  "author": {...},
  "comments": [...],
  "likes": 5,
  "saved": false
}
```

#### Create Post

```
POST /posts/
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "New Post",
  "content": "Post content...",
  "category": "Technology",
  "tags": [1, 2, 3]
}

Response: 201
{...}
```

#### Update Post

```
PUT /posts/{id}/
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Title",
  "content": "Updated content..."
}

Response: 200
{...}
```

#### Delete Post

```
DELETE /posts/{id}/
Authorization: Bearer <token>

Response: 204
```

### Comments

#### List Comments

```
GET /posts/{post_id}/comments/

Response: 200
[
  {
    "id": 1,
    "content": "Comment text",
    "author": "username",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Comment

```
POST /posts/{post_id}/comments/
Content-Type: application/json
Authorization: Bearer <token>

{
  "content": "Comment text"
}

Response: 201
{...}
```

### Categories

#### List Categories

```
GET /categories/

Response: 200
[
  {
    "id": 1,
    "name": "Technology"
  }
]
```

### Likes

#### Like Post

```
POST /posts/{post_id}/like/
Authorization: Bearer <token>

Response: 200
{
  "liked": true,
  "total_likes": 5
}
```

#### Unlike Post

```
POST /posts/{post_id}/unlike/
Authorization: Bearer <token>

Response: 200
{
  "liked": false,
  "total_likes": 4
}
```

### Save Posts

#### Save Post

```
POST /posts/{post_id}/save/
Authorization: Bearer <token>

Response: 200
{
  "saved": true
}
```

#### Get Saved Posts

```
GET /posts/saved/
Authorization: Bearer <token>

Response: 200
{
  "results": [...]
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid request data",
  "details": {...}
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "error": "You don't have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

## Pagination

Default page size: 10
Max page size: 100

```
GET /posts/?page=1&page_size=20
```

## Filtering

```
# By category
GET /posts/?category=1

# By author
GET /posts/?author=username

# Search
GET /posts/?search=keyword
```

## Sorting

```
# By newest first (default)
GET /posts/?ordering=-created_at

# By oldest first
GET /posts/?ordering=created_at

# By title
GET /posts/?ordering=title
```
