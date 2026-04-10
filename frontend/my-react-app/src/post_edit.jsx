import { useEffect, useState } from "react";
import "./Post_Edit.css";
import { useParams, useNavigate } from "react-router-dom";

export default function Post_Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    text: "",
    category: "",
    tags: [],
    is_private: false,
  });

  const [category, setCategory] = useState([]);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const token = localStorage.getItem("access");
  console.log(tags);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/category/`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data.results));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/Tag/`)
      .then((res) => res.json())
      .then((data) => setTags(data.data.results));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/singlePost/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        const postData = data.data;

        setPost({
          ...postData,
          category: postData.category || "",
          tags: postData.tags || [],
        });
      });
  }, [id, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", post.title);
    formData.append("text", post.text);
    formData.append("category", post.category);

    post.tags.forEach((t) => {
      formData.append("tags", t);
    });

    if (image) formData.append("image", image);
    if (thumbnail) formData.append("thumbnail_image", thumbnail);

    formData.append("is_private", post.is_private);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/selfPostUpdate/${id}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      navigate("/");
    }

    console.log(data);
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
        </form>
      </div>
    </div>
  );
}
