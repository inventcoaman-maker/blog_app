import { useState, useEffect } from "react";
import "./home.css";
import { Link, useSearchParams, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment as regularComment } from "@fortawesome/free-regular-svg-icons";
import { resolveImageUrl } from "./utils/imageUrl";

function Home() {
  const [posts, setPost] = useState([]);
  const [user, setUser] = useState({});
  const [Page, settPage] = useState(1);
  const [category, setCategory] = useState([]);
  const [tag, setTag] = useState([]);
  const [authors, setAuthors] = useState([]);
  // const [like,setLike]=useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem("access");
  // const { id } = useParams();
  console.log(authors);

  // tag.map((item, index) => console.log(item.id));
  // const new_arrr = [];
  // tag.map((item) => new_arrr.push(item));
  // console.log(new_arrr);

  // const arr=[];
  // new_arrr.map((item)=>(
  //   arr.push(item)

  // ))
  // console.log(arr);

  // console.log(new_arrr[]);

  // console.log(tag);
  // let new_arr = [];
  // for (let i = 0; i < tag.length; i++) {
  //   console.log(i.id);
  //   // new_arr.push(i[tag][id]);
  // }
  // console.log(new_arr);
  // console.log(new_arr);
  // console.log(posts);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/api/allPost/?page=${
      searchParams.get("page") || 1
    }&category=${searchParams.get("category") || ""}&tag=${
      searchParams.get("tag") || ""
    }&author=${searchParams.get("author") || ""}`;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(url, { headers })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.reload(); // auto logout
          return;
        }
        return res.json();
      })
      .then((data) => {
        setPost(data.data.results);
        settPage(data.data.total_pages);
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/singleUser/`, {
      headers,
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [searchParams]);

  let page_arr = [];
  for (let i = 1; i <= Page; i++) {
    page_arr.push(i);
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/category/`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data.results));

    fetch(`${import.meta.env.VITE_API_URL}/api/Tag/`)
      .then((res) => res.json())
      .then((data) => setTag(data.data.results));

    fetch(`${import.meta.env.VITE_API_URL}/api/authors/`)
      .then((res) => res.json())
      .then((data) => setAuthors(data.data.results));
  }, []);

  const handlePreviousChange = (e) => {
    const currentPage = parseInt(searchParams.get("page") || 1);
    if (currentPage > 1) {
      setSearchParams((prev) => {
        prev.set("page", currentPage - 1);
        return prev;
      });
    }
  };

  const handleNextChange = () => {
    const currentPage = parseInt(searchParams.get("page") || 1);

    if (currentPage < Page) {
      setSearchParams((prev) => {
        prev.set("page", currentPage + 1);
        return prev;
      });
    }
  };
  const handleCategoryChange = (e) => {
    const id = e.target.value;

    console.log(id);

    setSearchParams((prev) => {
      prev.set("category", id);
      prev.set("page", 1);
      return prev;
    });
  };
  const handleTagChange = (e) => {
    const id = e.target.value;
    setSearchParams((prev) => {
      prev.set("tag", id);
      prev.set("page", 1);
      return prev;
    });
  };

  const handleAuthorChange = (e) => {
    const id = e.target.value;
    // console.log(id);

    setSearchParams((prev) => {
      prev.set("author", id);
      prev.set("page", 1);
      return prev;
    });
  };
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/api/singlePost/${id}/`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const postData = data.data;

  //       const categoryId = category.find(
  //         (c) => c.name === postData.category_name,
  //       )?.id;

  //       setPost({
  //         ...postData,
  //         category: categoryId || "",
  //         tags: postData.tags || [],
  //       });
  //     });
  // }, [id, category]);
  const handleClick = (id) => {
    // const id = e.target.value;
    // console.log(id);

    // alert(e.target.innerText);
    setSearchParams((prev) => {
      prev.set("category", id);
      prev.set("page", 1);
      return prev;
    });
  };

  const handleauthorClick = (author) => {
    setSearchParams((prev) => {
      prev.set("author", author);
      prev.set("page", 1);
      return prev;
    });
  };

  const handleTagclick = (id) => {
    console.log(id);
    for (let i = 0; i < tag.length; i++) {
      console.log(tag[i].id);

      if (tag[i].name === id) {
        var idd = tag[i].id;
      }
    }

    console.log(idd);
    // console.log(id);

    setSearchParams((prev) => {
      prev.set("tag", idd);
      prev.set("page", 1);
      return prev;
    });
  };

  return (
    <div className="home-container">
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome to Django Girls Blog</h1>
          <p>Discover amazing posts from our community</p>
          {user?.email && (
            <div className="user-greeting">
              <span className="greeting-text">Hello, {user.email}!</span>
            </div>
          )}
        </div>
      </div>

      {Page > 1 && (
        <div className="pagination-section">
          <nav className="pagination-nav">
            <button
              className="pagination-btn prev-btn"
              disabled={searchParams.get("page") === "1"}
              onClick={handlePreviousChange}
            >
              ← Previous
            </button>

            <div className="pagination-numbers">
              {page_arr.map((item) => (
                <button
                  key={item}
                  className={`pagination-btn number-btn ${
                    searchParams.get("page") === item.toString() ? "active" : ""
                  }`}
                  onClick={() =>
                    setSearchParams((prev) => {
                      prev.set("page", item);
                      return prev;
                    })
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn next-btn"
              disabled={searchParams.get("page") === Page.toString()}
              onClick={handleNextChange}
            >
              Next →
            </button>
          </nav>
        </div>
      )}

      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select onChange={handleCategoryChange} className="filter-select">
              <option value="">All Categories</option>
              {category.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Tag</label>
            <select onChange={handleTagChange} className="filter-select">
              <option value="">All Tags</option>
              {tag.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Author</label>
            <select onChange={handleAuthorChange} className="filter-select">
              <option value="">All Authors</option>
              {authors.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="posts-section">
        <div className="posts-grid">
          {posts.map((post) =>
            token || !post.is_private ? (
              <div className="post-card" key={post.id}>
                <div className="post-image-container">
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
                      <span className="post-date">📅 {post.created_date}</span>
                    </div>

                    <div className="right">
                      {user.email === post.email && (
                        <Link
                          to={`/post_edit/${post.id}`}
                          className="edit-link"
                        >
                          ✏️ Edit
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="like_comment">
                    <div className="icon_group">
                      {post.total_likes > 0 ? (
                        <>
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="like_icon"
                          />
                          <p>{post.total_likes}</p>
                        </>
                      ) : (
                        <FontAwesomeIcon icon={faHeart} />
                      )}
                    </div>

                    <div className="icon_group">
                      <FontAwesomeIcon icon={regularComment} />
                      <p>{post.total_comments}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
