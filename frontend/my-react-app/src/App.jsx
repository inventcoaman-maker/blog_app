import "./App.css";
import Signup from "./signup.jsx";
import Header from "./header";
import Login from "./login.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "./home.jsx";
import Add_post from "./Add_Post.jsx";
import { Profiler } from "react";
import Profile from "./profile.jsx";
import ChangePassword from "./changePassword.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Post_detail from "./post_detail.jsx";
import Post_Edit from "./post_edit.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./protectedRoute.jsx";

function App() {
  return (
    <>
      <Header />
      <ToastContainer autoClose={1000} theme="colored" />
      {/* <protected route */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/add_post" element={<Add_post />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/post_detail/:id" element={<Post_detail />} />
        <Route path="/post_edit/:id" element={<Post_Edit />} />
      </Routes>
    </>
  );
}

export default App;
