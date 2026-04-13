import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./post_detail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { resolveImageUrl } from "./utils/imageUrl";

export default function Post_detail() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [reply, setReply] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyInput, setReplyInput] = useState(false);
  const [like, setLike] = useState(false);
  // const [likeToggle, setLikeToggle] = useState(false);
  // console.log(comment);
  console.log(reply);
  console.log(post);
  console.log(user);

  // const token = localStorage.getItem("access")

  // comment.map((value) => console.log(value.id));
  const token = localStorage.getItem("access");

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${import.meta.env.VITE_API_URL}/api/singlePost/${id}/`, {
      headers,
    })
      .then((res) => res.json())
      .then((data) => setPost(data.data));
    // .then((data) => setLike(data.data.is_liked));
  }, []);

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
  const fetchComments = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/comment/${id}/`,
    );
    const data = await res.json();
    setComment(data.data);
  };
  useEffect(() => {
    fetchComments();
  }, [id]);

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
      fetchComments();
    }
  };

  const fetchReply = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reply/${id}/`);
    const data = await res.json();
    setReply(data.data);
  };
  useEffect(() => {
    fetchReply();
  }, [id, comment]);
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
      fetchReply();
    }
  };
  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${import.meta.env.VITE_API_URL}/api/singleUser/`, { headers })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [token]);

  const handleReply = () => setReplyInput((prev) => !prev);

  const handleLike = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/like/${id}/`, {
      method: "POST",
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
    }
  }, [post]);

  // const handleLikeToggle = () => {
  //   setLikeToggle((prev) => !prev);
  // };

  return (
    <>
      <div className="post-container">
        <div className="post-grid">
          <div className="post-card">
            <h1 className="post-title">{post.title}</h1>

            {post.thumbnail_image ? (
              <img
                src={resolveImageUrl(post.thumbnail_image)}
                alt="Post"
                className="post-image"
              />
            ) : null}

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
                      {value.text}{" "}
                      <button
                        onClick={handleReply}
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
                    {replyInput ? (
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
                    ) : null}
                  </div>
                ))}
                <FontAwesomeIcon
                  onClick={handleLike}
                  icon={like ? solidHeart : regularHeart}
                  style={{
                    cursor: "pointer",
                    fontSize: "26px",
                    color: like ? "red" : "black",
                    transition: "all 0.2s ease",
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

            {user?.email === post?.email && (
              <Link to={`/post_edit/${post.id}`} className="edit-link">
                ✏️ Edit
              </Link>
            )}
          </div>
        </div>

        <div className="back-btn">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </>
  );
}
