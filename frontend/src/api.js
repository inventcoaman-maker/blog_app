import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem("access", response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Signup
export const signup = async (userData) => {
  const response = await api.post("/signup/", userData);
  return response.data;
};

// Login with password
export const login = async (credentials) => {
  const response = await api.post("/login/", credentials);
  if (response.data.access_token) {
    localStorage.setItem("access", response.data.access_token);
    localStorage.setItem("refresh", response.data.refresh_token);
  }
  return response.data;
};

// Generate OTP
export const generateOtp = async (email) => {
  const response = await api.post("/genrateOtp/", { email });
  return response.data;
};

// Verify OTP
export const verifyOtp = async (otpData) => {
  const response = await api.post("/verifyOtp/", otpData);
  // console.log("FULL RESPONSE:", response.data);

  if (response.data.access) {
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
  }
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post("/logout/");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  return response.data;
};

// Get all users
export const getAllUsers = async (page = 1) => {
  const response = await api.get(`/allUsers/?page=${page}`);
  return response.data;
};



// Update current user
export const updateCurrentUser = async (userData) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => {
    if (userData[key]) {
      formData.append(key, userData[key]);
    }
  });
  const response = await api.patch("/singleUser/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.patch("/changePassword/", passwordData);
  return response.data;
};

// Get profile
export const getProfile = async () => {
  const response = await api.get("/profile/");
  return response.data;
};

// Update profile
export const updateProfile = async (profileData) => {
  const formData = new FormData();
  const token = localStorage.getItem("access");
  Object.keys(profileData).forEach((key) => {
    if (profileData[key]) {
      formData.append(key, profileData[key]);
    }
  });
  const response = await api.put("/profile/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Create post
export const createPost = async (postData) => {
  const formData = new FormData();
  Object.keys(postData).forEach((key) => {
    if (key === "tags" && Array.isArray(postData[key])) {
      postData[key].forEach((tag) => formData.append("tags", tag));
    } else if (postData[key] !== null && postData[key] !== undefined) {
      formData.append(key, postData[key]);
    }
  });
  const response = await api.post("/postCreate/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get all posts
export const getAllPosts = async (page = 1) => {
  const response = await api.get(`/allPost/?page=${page}`);
  return response.data;
};

// Get current user's posts
export const getCurrentUserPosts = async () => {
  const response = await api.get("/currentUserPost/");
  return response.data;
};

// Get single post
export const getSinglePost = async (postId) => {
  const response = await api.get(`/singlePost/${postId}/`);
  return response.data;
};

// Update post
export const updatePost = async (postId, postData) => {
  const formData = new FormData();
  Object.keys(postData).forEach((key) => {
    if (key === "tags" && Array.isArray(postData[key])) {
      postData[key].forEach((tag) => formData.append("tags", tag));
    } else if (postData[key] !== null && postData[key] !== undefined) {
      formData.append(key, postData[key]);
    }
  });
  const response = await api.put(`/selfPostUpdate/${postId}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete post
export const deletePost = async (postId) => {
  const response = await api.delete(`/selfPostDelete/${postId}/`);
  return response.data;
};

// Get all categories
export const getCategories = async () => {
  const response = await api.get("/category/");
  return response.data;
};

// Create category
export const createCategory = async (categoryData) => {
  const response = await api.post("/category/", categoryData);
  return response.data;
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(
    `/categoryupdateDelete/${categoryId}/`,
    categoryData,
  );
  return response.data;
};

// Delete category
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/categoryupdateDelete/${categoryId}/`);
  return response.data;
};

// Get all tags
export const getTags = async () => {
  const response = await api.get("/Tag/");
  return response.data;
};

// Create tag
export const createTag = async (tagData) => {
  const response = await api.post("/Tag/", tagData);
  return response.data;
};

// Update tag
export const updateTag = async (tagId, tagData) => {
  const response = await api.put(`/tagupdateDelete/${tagId}/`, tagData);
  return response.data;
};

// Delete tag
export const deleteTag = async (tagId) => {
  const response = await api.delete(`/tagupdateDelete/${tagId}/`);
  return response.data;
};

// Get comments for a post
export const getComments = async (postId) => {
  const response = await api.get(`/comment/${postId}/`);
  return response.data;
};

// Create comment
export const createComment = async (postId, commentData) => {
  const response = await api.post(`/comment/${postId}/`, commentData);
  return response.data;
};

// Get replies for a post
export const getReplies = async (postId) => {
  const response = await api.get(`/reply/${postId}/`);
  return response.data;
};

// Create reply
export const createReply = async (postId, replyData) => {
  const response = await api.post(`/reply/${postId}/`, replyData);
  return response.data;
};

// Like/unlike post
export const toggleLike = async (postId) => {
  const response = await api.post(`/like/${postId}/`);
  return response.data;
};

// Pin/unpin post
export const togglePinPost = async (postId) => {
  const response = await api.post(`/pin_post/${postId}/`);
  return response.data;
};

// Save/unsave post
export const toggleSavedPost = async (postId) => {
  const response = await api.post(`/savedPost/${postId}/`);
  return response.data;
};

export const getSavedPosts = async () => {
  const response = await api.get("/allSavedPost/");
  return response.data;
};

export const getAuthors = async () => {
  const response = await api.get("/authors/");
  return response.data;
};

export const activity = async () => {
  const response = await api.get("/history/");
  return response.data;
};

export const historyDelete = async () => {
  const response = await api.delete("/historyDelete/");
  return response.data;
};

export default api;
