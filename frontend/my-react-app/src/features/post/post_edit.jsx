import { useEffect, useState } from "react";
import "./Post_Edit.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Post_Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    text: "",
    category: null,
    tags: [],
    is_private: false,
  });

  const [category, setCategory] = useState([]);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, tagRes] = await Promise.all([
          axios.get(`${API_URL}/api/category/`),
          axios.get(`${API_URL}/api/Tag/`),
        ]);
        setCategory(categoryRes.data.data.results);
        setTags(tagRes.data.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/singlePost/${id}/`);
        const postData = response.data.data;
        setPost({
          ...postData,
          category: postData.category || "",
          tags: postData.tags || [],
        });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", post.title);
    formData.append("text", post.text);
    formData.append("category", post.category || "");

    post.tags.forEach((t) => {
      formData.append("tags", t);
    });

    if (image) formData.append("image", image);
    if (thumbnail) formData.append("thumbnail_image", thumbnail);

    formData.append("is_private", post.is_private);

    try {
      const response = await axios.put(
        `${API_URL}/api/selfPostUpdate/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response);

      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="edit-wrapper">
      <div className="edit-card">
        <h2>Edit Post</h2>

        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />

          <label>Text:</label>
          <textarea
            type="text"
            value={post.text}
            onChange={(e) => setPost({ ...post, text: e.target.value })}
            rows="6"
          ></textarea>

          <label>Category:</label>
          <select
            value={post.category || ""}
            onChange={(e) =>
              setPost({ ...post, category: Number(e.target.value) })
            }
          >
            <option value="">Select Category</option>
            {category.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>

          <label>Tags:</label>
          <select
            multiple
            value={post.tags || []}
            onChange={(e) =>
              setPost({
                ...post,
                tags: [...e.target.selectedOptions].map((opt) =>
                  Number(opt.value),
                ),
              })
            }
          >
            {tags.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>

          <div className="file-field">
            <label htmlFor="image">Image:</label>
            {post.image && <p>Current: {post.image.split("/").pop()}</p>}
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="file-field">
            <label htmlFor="thumbnail">Thumbnail:</label>
            {post.thumbnail_image && (
              <p>Current: {post.thumbnail_image.split("/").pop()}</p>
            )}
            {/* {post.thumbnail_image && (
              // <p>Current: {post.thumbnail_image.split("/").pop()}</p>
            )} */}
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </div>

          <div className="checkbox">
            <input
              id="is_private"
              type="checkbox"
              checked={post.is_private || false}
              onChange={(e) =>
                setPost({ ...post, is_private: e.target.checked })
              }
            />
            <label htmlFor="is_private">Is private</label>
          </div>
          <button className="save-btn">Save</button>
          <div className="home_div">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="profilee-btn"
            >
              <FontAwesomeIcon icon={faHouse} className="home-icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
