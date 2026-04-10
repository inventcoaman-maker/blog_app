import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Add_Post.css";

function Add_post() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  console.log(token);

  const [category, setCategory] = useState([]);
  const [tag, setTag] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [values, setValue] = useState({
    title: "",
    text: "",
    category: "",
    tags: [],
    is_private: false,
  });
  console.log();

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
    fetch(`${import.meta.env.VITE_API_URL}/api/category/`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data.results));

    fetch(`${import.meta.env.VITE_API_URL}/api/Tag/`)
      .then((res) => res.json())
      .then((data) => setTag(data.data.results));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("text", values.text);
    formData.append("category", values.category);

    values.tags.forEach((t) => {
      formData.append("tags", t);
    });
    if (file) formData.append("image", file);
    if (thumbnail) formData.append("thumbnail_image", thumbnail);
    formData.append("is_private", values.is_private);

    console.log([...formData]);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/postCreate/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      navigate("/");
    } else {
      setError(data.error);
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
            <select name="category" onChange={handleChange}>
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

          {error ? <div className="error-message">{error}</div> : null}

          <button className="submit-btn">Create Post</button>
        </div>
      </div>
    </form>
  );
}

export default Add_post;
