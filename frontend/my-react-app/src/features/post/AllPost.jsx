import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PostSkeleton from "../post/PostSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment as regularComment } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { resolveImageUrl } from "../../utils/imageUrl";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { UserContext } from "../context/authContext";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("access");
  const [loading, setLoading] = useState(true);
  // const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_URL}/api/allSavedPost/`, {
          headers,
        });
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [token]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     if (!token) return;
  //     try {
  //       const response = await axios.get(`${API_URL}/api/singleUser/`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };
  //   fetchUser();
  // }, [token]);

  useEffect(() => {
    const time = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(time);
  }, []);

  const handleClick = (categoryId) => {
    navigate(`/?category=${categoryId}`);
  };

  const handleTagclick = (tag) => {
    navigate(`/?tag=${tag}`);
  };

  const handleauthorClick = (authorId) => {
    navigate(`/?author=${authorId}`);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_URL}/api/selfPostDelete/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/like/${postId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked: response.data.is_liked,
                total_likes: response.data.total_likes,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  return (
    <div className="posts-section">
      <div className="posts-grid">
        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <PostSkeleton key={`skeleton-${index}`} />
            ))
          : posts.map((post) =>
              token || !post.is_private || post.pin_post ? (
                <div className="post-card" key={post.id}>
                  <div className="post-image-container">
                    {post.saved_post && <FontAwesomeIcon icon={faBookmark} />}
                    {post.image ? (
                      <img
                        src={resolveImageUrl(post.image)}
                        alt={post.title}
                        className="post-image"
                      />
                    ) : null}
                  </div>

                  <div className="post-content">
                    <h3 className="post-title">
                      <Link to={`/post_detail/${post.id}`}>{post.title}</Link>
                    </h3>

                    <p
                      className="post-category"
                      onClick={() => handleClick(post.category)}
                    >
                      📁 {post.category_name}
                    </p>

                    <p className="post-text">{post.text}</p>

                    <div className="post-tags">
                      {post.tag_names?.map((tag, i) => (
                        <span
                          key={i}
                          onClick={() => handleTagclick(tag)}
                          className="tag-chip"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="post-footer">
                      <div className="left">
                        <span
                          onClick={() => handleauthorClick(post.author)}
                          className="post-author"
                        >
                          👤 {post.email}
                        </span>
                        <span className="post-date">
                          📅 {post.created_date}
                        </span>
                      </div>

                      <div className="right">
                        {user?.email === post.email && (
                          <div className="edit_delete">
                            <Link
                              to={`/post_edit/${post.id}`}
                              className="edit-link"
                            >
                              ✏️ Edit
                            </Link>
                            <div className="">
                              <svg
                                onClick={() => handleDelete(post.id)}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="like_comment">
                      <div
                        className="icon_group"
                        onClick={() => handleLike(post.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon
                          icon={post.is_liked ? solidHeart : regularHeart}
                          className={`like_icon ${post.is_liked ? "liked" : "unliked"}`}
                        />
                        <p>{post.total_likes}</p>
                      </div>

                      <div className="icon_group">
                        <FontAwesomeIcon icon={regularComment} />
                        <p>{post.total_comments}</p>
                      </div>
                      {post.pin_post && (
                        <div className="">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            style={{ cursor: "pointer" }}
                            className="bi bi-pin pin-icon"
                            viewBox="0 0 16 16"
                          >
                            <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null,
            )}
      </div>
      <div className="home_div">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="profilee-btn"
        >
          <FontAwesomeIcon icon={faHouse} className="home-icon" />
        </button>
      </div>
    </div>
  );
}
