import "./App.css";
import Signup from "./features/auth/signup.jsx";
import Header from "./features/header/header";
import Login from "./features/auth/login.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "./features/Home/home.jsx";
import Add_post from "./features/post/Add_Post.jsx";
import { Profiler } from "react";
import Profile from "./features/header/profile.jsx";
import ChangePassword from "./features/header/changePassword.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Post_detail from "./features/post/post_detail.jsx";
import Post_Edit from "./features/post/post_edit.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./protectedRoute.jsx";
import AllPost from "./features/post/AllPost.jsx";

function App() {
  return (
    <>
      <Header />
      <ToastContainer autoClose={1000} theme="colored" />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/add_post" element={<Add_post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/post_detail/:id" element={<Post_detail />} />
        <Route path="/post_edit/:id" element={<Post_Edit />} />
        <Route path="/allPost" element={<AllPost />} />
      </Routes>
    </>
  );
}

export default App;
