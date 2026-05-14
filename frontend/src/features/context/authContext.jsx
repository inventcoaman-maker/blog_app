import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUser = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/api/singleUser/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      setUser(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
