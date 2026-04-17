import { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./post_detail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { resolveImageUrl } from "./utils/imageUrl";
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
      .then((res) => res.json())
      .then((data) => {
        setPost(data.data);
        setPin(data.data.pin_post);
      });
    // .then((data) => setLike(data.data.is_liked));
  }, [id, token]);

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
                    {replyInput === value.id ? (
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
                  <div className="">
                    <svg
                      onClick={() => handleDelete(post.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      cursor="pointer"
                      fill="currentColor"
                      class="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </div>
                  {token && (
                    <div className="">
                      {pin ? (
                        <svg
                          onClick={handlePin}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          class="bi bi-pin"
                          viewBox="0 0 16 16"
                          cursor="pointer"
                        >
                          <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 1 1 0 0 1-1 0V2a.5.5 0 0 1 .146-.354z" />
                        </svg>
                      ) : (
                        <svg
                          onClick={handlePin}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          cursor="pointer"
                          class="bi bi-pin"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                        </svg>
                      )}
                    </div>
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
