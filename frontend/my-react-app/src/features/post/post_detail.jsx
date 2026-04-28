import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./post_detail.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { resolveImageUrl } from "../../utils/imageUrl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Post_detail() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [reply, setReply] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replyInput, setReplyInput] = useState(null);
  const [like, setLike] = useState(false);
  const [refreshApi, setRefreshApi] = useState(false);
  const [pin, setPin] = useState(false);
  const [totalPinPost, setTotalPinPost] = useState([]);
  const [error, setError] = useState("");
  const [savedPost, setSavedPost] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_URL}/api/singlePost/${id}/`, {
          headers,
        });
        setPost(response.data.data);
        setPin(response.data.data.pin_post);
        setSavedPost(response.data.data.saved_post);
        setError("");
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Post not found or failed to load.");
        setPost(null);
      }
    };
    fetchPost();
  }, [id, token]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/comment/${id}/`);
        setComment(response.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id, refreshApi]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/reply/${id}/`);
        setReply(response.data.data);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };
    fetchReplies();
  }, [id, refreshApi]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/api/singleUser/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/api/currentUserPost/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalPinPost(response.data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    fetchUserPosts();
  }, [token]);

  const handleComment = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentClick = async () => {
    try {
      await axios.post(
        `${API_URL}/api/comment/${id}/`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCommentText("");
      setRefreshApi((prev) => !prev);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleReplyClick = async (commentId) => {
    try {
      await axios.post(
        `${API_URL}/api/reply/${id}/`,
        {
          text: replyText[commentId],
          comment: commentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setRefreshApi((prev) => !prev);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleReply = (commentId) => {
    setReplyInput((prev) => (prev === commentId ? null : commentId));
  };

  const handleLike = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/like/${id}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setLike(response.data.liked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  useEffect(() => {
    if (post) {
      setLike(post.is_liked);
      setSavedPost(post.saved_post);
    }
  }, [post]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${API_URL}/api/selfPostDelete/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
      toast.success("post deleted successfully 🎉");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handlePin = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/pin_post/${id}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPin(response.data.pin_post);
      toast.success(response.data.pin_post ? "Post pinned" : "Post unpinned");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to pin post");
    }
  };

  const handleSavedPost = async (postId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/savedPost/${postId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSavedPost(response.data.saved_post);
      toast.success(response.data.saved_post ? "Post saved" : "Post unsaved");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save post");
    }
  };

  return (
    <>
      <div className="post-container">
        <div className="post-grid">
          <div className="post-card">
            <div className="title_saved">
              <h1 className="post-title">{post.title}</h1>
              {/* {savedPost ? (
                <FontAwesomeIcon
                  onClick={handleSavedPost(post.id)}
                  style={{ cursor: "pointer" }}
                  icon={faBookmark}
                />
              ) : (
                <FontAwesomeIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSavedPost(post.id)}
                  icon={faBookmarkRegular}
                />
              )} */}
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                onClick={() => handleSavedPost(post.id)}
                icon={savedPost ? faBookmark : faBookmarkRegular}
              />
            </div>

            {post.thumbnail_image && (
              <img
                src={resolveImageUrl(post.thumbnail_image)}
                alt="Post"
                className="post-image"
              />
            )}

            <div className="post-meta">
              <p>
                <b>Category:</b> {post.category_name}
              </p>

              <p>
                <b>Tags:</b>
              </p>

              <div className="tags">
                {post.tag_names?.map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p>{post.text}</p>

            {token && (
              <>
                <div className="comment-box">
                  <input
                    className="comment-input"
                    value={commentText}
                    onChange={handleComment}
                    placeholder="Add comment"
                  />
                  <button className="comment-btn" onClick={handleCommentClick}>
                    Comment
                  </button>
                </div>

                {comment.map((value) => (
                  <div key={value.id} className="comment-item">
                    <div>
                      {value.text}
                      <button
                        onClick={() => handleReply(value.id)}
                        type="button"
                        className="btn btn-secondary"
                      >
                        reply
                      </button>
                    </div>

                    {reply.map((r) =>
                      r.comment === value.id ? (
                        <div key={r.id} className="reply-item">
                          {r.text}
                        </div>
                      ) : null,
                    )}

                    {replyInput === value.id && (
                      <div className="reply-box">
                        <input
                          value={replyText[value.id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [value.id]: e.target.value,
                            }))
                          }
                        />
                        <button onClick={() => handleReplyClick(value.id)}>
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <FontAwesomeIcon
                  onClick={handleLike}
                  icon={like ? solidHeart : regularHeart}
                  className={`like-icon ${like ? "liked" : ""}`}
                  style={{
                    cursor: "pointer",
                    fontSize: "26px",
                    transition: "all 0.2s ease",
                    marginTop: "10px",
                    transform: like ? "scale(1.2)" : "scale(1)",
                  }}
                />
              </>
            )}
          </div>

          <div className="sidebar">
            <p>
              <b>Author:</b> {post.email}
            </p>
            <p>
              <b>Date:</b> {post.created_date?.split("T")[0]}
            </p>

            <div className="edit_delete">
              {user?.email === post?.email && (
                <>
                  <Link to={`/post_edit/${post.id}`} className="edit-link">
                    ✏️ Edit
                  </Link>

                  <svg
                    onClick={() => handleDelete(post.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    style={{ cursor: "pointer" }}
                    class="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                  {token && (
                    <svg
                      onClick={handlePin}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      style={{
                        cursor: "pointer",
                        color: pin ? "black" : "gray",
                        transform: pin ? "rotate(0deg)" : "rotate(45deg)",
                        transition: "0.2s",
                      }}
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354" />
                    </svg>
                  )}
                </>
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
        </div>
      </div>
    </>
  );
}
