# Frontend Development Guide

## Component Structure

Each component follows this pattern:

```
ComponentName/
├── ComponentName.jsx      # Component logic
├── ComponentName.css      # Component styles
├── hooks/                 # Custom hooks (if needed)
│   └── useComponentHook.js
└── __tests__/
    └── ComponentName.test.jsx
```

## Best Practices

### 1. Use Custom Hooks

```jsx
// hooks/useFetch.js
import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};
```

### 2. Centralize API Calls

```jsx
// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Posts
  getPosts: () => API.get("/posts/"),
  getPost: (id) => API.get(`/posts/${id}/`),
  createPost: (data) => API.post("/posts/", data),
  updatePost: (id, data) => API.put(`/posts/${id}/`, data),
  deletePost: (id) => API.delete(`/posts/${id}/`),

  // Comments
  getComments: (postId) => API.get(`/posts/${postId}/comments/`),
  createComment: (postId, data) => API.post(`/posts/${postId}/comments/`, data),

  // Likes
  likePost: (postId) => API.post(`/posts/${postId}/like/`),
  unlikePost: (postId) => API.post(`/posts/${postId}/unlike/`),

  // Authentication
  login: (email, password) => API.post("/auth/login/", { email, password }),
  register: (data) => API.post("/auth/register/", data),
  logout: () => API.post("/auth/logout/"),
};

export default API;
```

### 3. Component Composition

```jsx
// components/Post/PostCard.jsx
import "./PostCard.css";

export default function PostCard({ post, onDelete, onEdit }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <h3>{post.title}</h3>
        <span className="category">{post.category}</span>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-footer">
        <span className="author">{post.author}</span>
        <span className="date">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="post-actions">
        <button onClick={() => onEdit(post.id)}>Edit</button>
        <button onClick={() => onDelete(post.id)}>Delete</button>
      </div>
    </div>
  );
}
```

### 4. Error Handling

```jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

export default function PostForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/posts/", formData);
      toast.success("Post created successfully");
      // Redirect or update state
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to create post";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      {/* Form fields */}
    </form>
  );
}
```

### 5. Environment Variables

Create `.env` file in frontend directory:

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Blog App
VITE_APP_VERSION=1.0.0
```

Access in code:

```jsx
const API_URL = import.meta.env.VITE_API_URL;
```

## File Organization

```
src/
├── components/           # Reusable components
│   ├── Header/
│   ├── Post/
│   ├── Auth/
│   └── Common/
├── pages/               # Page components
│   ├── Home.jsx
│   ├── Profile.jsx
│   └── NotFound.jsx
├── services/            # API services
│   ├── api.js
│   └── auth.js
├── hooks/              # Custom hooks
│   ├── useFetch.js
│   ├── useAuth.js
│   └── useTheme.js
├── utils/              # Utility functions
│   ├── constants.js
│   ├── formatDate.js
│   └── validators.js
├── assets/             # Static files
│   ├── css/
│   ├── images/
│   └── icons/
├── types/              # TypeScript types (if using)
│   ├── post.ts
│   ├── user.ts
│   └── comment.ts
├── App.jsx
├── main.jsx
└── index.css
```

## Testing

### Component Test Example

```jsx
// __tests__/PostCard.test.jsx
import { render, screen } from "@testing-library/react";
import PostCard from "../PostCard";

describe("PostCard", () => {
  const mockPost = {
    id: 1,
    title: "Test Post",
    content: "Test content",
    author: "Test Author",
    created_at: "2024-01-01T00:00:00Z",
  };

  it("renders post card correctly", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = jest.fn();
    render(<PostCard post={mockPost} onEdit={onEdit} />);
    screen.getByText("Edit").click();
    expect(onEdit).toHaveBeenCalledWith(1);
  });
});
```

## Performance Tips

1. **Use React.memo for expensive components**

```jsx
export default React.memo(PostCard);
```

2. **Lazy load components**

```jsx
import { lazy, Suspense } from "react";
const PostDetail = lazy(() => import("./PostDetail"));

<Suspense fallback={<Loading />}>
  <PostDetail />
</Suspense>;
```

3. **Optimize re-renders with useMemo**

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

4. **Use useCallback for event handlers**

```jsx
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```
