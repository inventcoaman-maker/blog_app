import { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./post_detail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { resolveImageUrl } from "../../utils/imageUrl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  // const [likeToggle, setLikeToggle] = useState(false);
  // console.log(comment);
  console.log(totalPinPost);
  // console.log(post);
  // console.log(user);

  // const token = localStorage.getItem("access")

  // comment.map((value) => console.log(value.id));
  const token = localStorage.getItem("access");

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${import.meta.env.VITE_API_URL}/api/singlePost/${id}/`, {
      headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPost(data.data);
        console.log(data.data);

        setPin(data.data.pin_post);
        setSavedPost(data.data.saved_post);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch post:", err);
        setError("Post not found or failed to load.");
        setPost(null);
      });
  }, [id]);

  const handleComment = (e) => {
    setCommentText(e.target.value);
  };

  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/api/comment/${id}/`)
  //     .then((res) => res.json())
  //     .then((data) => setComment(data.data));
  // }, [id]);

  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/api/reply/${id}/`)
  //     .then((res) => res.json())
  //     .then((data) => setReply(data.data));
  // }, [id]);
  // reply;
  // const fetchComments = async () => {
  //   const res = await fetch(
  //     `${import.meta.env.VITE_API_URL}/api/comment/${id}/`,
  //   );
  //   const data = await res.json();
  //   setComment(data.data);
  // };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/comment/${id}/`)
      .then((res) => res.json())
      .then((data) => setComment(data.data));
  }, [id, refreshApi]);

  // useEffect(() => {
  //   fetchComments();
  // }, [id]);

  const handleCommentClick = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/comment/${id}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: commentText,
        }),
      },
    );
    if (res.ok) {
      setCommentText("");
      setRefreshApi((prev) => !prev);
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reply/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        //  console.log("reply data", data);
        setReply(data.data);
      });
    // const data = await res.json();
    // setReply(data.data);
  }, [id, refreshApi]);

  const handleReplyClick = async (commentId) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/reply/${id}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: replyText[commentId],
          comment: commentId,
        }),
      },
    );

    if (res.ok) {
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setRefreshApi((prev) => !prev);
    }
  };
  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${import.meta.env.VITE_API_URL}/api/singleUser/`, { headers })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [token]);

  const handleReply = (commentId) =>
    setReplyInput((prev) => (prev === commentId ? null : commentId));

  const handleLike = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/like/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLike(data.liked);

    // setLikeCount(data.like_count);
  };
  useEffect(() => {
    if (post) {
      setLike(post.is_liked);
      setSavedPost(post.saved_post);
    }
  }, [post]);

  const handleDelete = async (id) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/selfPostDelete/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (res.ok) {
      navigate("/");
      toast.success("post deleted successfully 🎉");
    }
  };

  const handlePin = async () => {
    const url = `${import.meta.env.VITE_API_URL}/api/pin_post/${id}/`;
    // if (totalPinPost.length >= 3 && !pin) {
    //   const res = await fetch(url, {
    //     method: "PATCH",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   const data = await res.json();
    //   if (res.ok) {
    //     toast.error(
    //       "You can only pin up to 3 posts. Please unpin another post before pinning this one.",
    //     );
    //   }
    //   return;
    // }

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // const res = await fetch(url, {
    //   method: "PATCH",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const data = await res.json();
    setPin(data.pin_post);
    if (res.ok) {
      toast.success(data.pin_post ? "Post pinned" : "Post unpinned");
    } else {
      toast.error(data.error);
    }

    // if(totalPinPost.length >= 3 && !pin){
    //   toast.error("You can only pin up to 3 posts. Please unpin another post before pinning this one.");
    // }
  };
  console.log(post);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${import.meta.env.VITE_API_URL}/api/currentUserPost/`, { headers })
      .then((res) => res.json())
      .then((data) => setTotalPinPost(data));
  }, [token]);
  // console.log(totalPinPost);
  // const pin_post_arr = [];
  // totalPinPost.forEach((value) => {
  //   // console.log(value.pin_post === true)
  //   if (value.pin_post === true) {
  //     pin_post_arr.push(value.pin_post);
  //   }
  // });
  // console.log(pin_post_arr);

  // const currentUser= async ()=>{
  //   const res= await fetch(`${import.meta.env.VITE_API_URL}/api/currentUserPost/`)

  // }

  // const handleLikeToggle = () => {
  //   setLikeToggle((prev) => !prev);
  // };
  const handleSavedPost = async (id) => {
    const url = `${import.meta.env.VITE_API_URL}/api/savedPost/${id}/`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSavedPost(data.saved_post);
    if (res.ok) {
      toast.success(data.saved_post ? "Post saved" : "Post unsaved");
    } else {
      toast.error(data.error);
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
                      style={{ cursor: "pointer" }}
                      className="bi bi-pin pin-icon"
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
