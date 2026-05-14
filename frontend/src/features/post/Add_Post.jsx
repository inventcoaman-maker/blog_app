import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Add_Post.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Add_post() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [category, setCategory] = useState([]);
  const [tag, setTag] = useState([]);
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [values, setValue] = useState({
    title: "",
    text: "",
    category: null,
    tags: [],
    is_private: false,
  });

  const handleChange = (e) => {
    if (e.target.multiple) {
      const selected = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value,
      );

      setValue((old) => ({
        ...old,
        [e.target.name]: selected,
      }));
    } else if (e.target.type === "checkbox") {
      setValue((old) => ({
        ...old,
        [e.target.name]: e.target.checked,
      }));
    } else {
      setValue((old) => ({
        ...old,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, tagRes] = await Promise.all([
          axios.get(`${API_URL}/api/category/`),
          axios.get(`${API_URL}/api/Tag/`),
        ]);
        setCategory(categoryRes.data.data.results);
        setTag(tagRes.data.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("text", values.text);
    formData.append("category", values.category || "");

    values.tags.forEach((t) => {
      formData.append("tags", t);
    });
    if (file) formData.append("image", file);
    if (thumbnail) formData.append("thumbnail_image", thumbnail);
    formData.append("is_private", values.is_private);

    try {
      await axios.post(`${API_URL}/api/postCreate/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Post created successfully");
      navigate("/");
    } catch (error) {
      const data = error.response?.data;
      if (data?.text) {
        toast.error(data.text[0]);
      } else if (data?.title) {
        toast.error(data.title[0]);
      } else {
        toast.error("title and text are required");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="add-post-container">
        <div className="add-post-card">
          <h2>Create Post</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={values.title}
              onChange={handleChange}
              type="text"
              placeholder="Enter title"
            />
          </div>
          <div className="form-group">
            <label>Text</label>
            <textarea
              name="text"
              value={values.text}
              onChange={handleChange}
              placeholder="Write your content..."
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              onChange={handleChange}
              value={values.category || ""}
            >
              <option value="">Select Category</option>
              {category.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tags</label>
            <select name="tag" multiple onChange={handleChange}>
              {tag.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Upload Image</label>
            <div className="file-input-wrapper">
              <label className="file-input-label">
                📁 Choose Image File
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
            {file && <div className="file-name">Selected: {file.name}</div>}
          </div>
          <div className="form-group">
            <label>Upload Thumbnail Image</label>
            <div className="file-input-wrapper">
              <label className="file-input-label">
                📁 Choose Thumbnail File
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                />
              </label>
            </div>
            {thumbnail && (
              <div className="file-name">Selected: {thumbnail.name}</div>
            )}
          </div>
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_private"
                checked={values.is_private}
                onChange={handleChange}
              />
              Private Post
            </label>
          </div>
          <button className="submit-btn">Create Post</button>
          {/* <div className="">{error && toast.error(error)}</div> */}

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
    </form>
  );
}

export default Add_post;
