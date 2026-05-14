import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import "./history.css";
import { activity, historyDelete } from "../../api/api.js";

export default function History() {
  const [history, setHistory] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const token = localStorage.getItem("access");

  // 🔹 Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await activity();
        setHistory(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, []);

  const handleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDelete = async () => {
    try {
      await historyDelete(selectedIds);

      setHistory((prev) =>
        prev.filter((item) => !selectedIds.includes(item.id)),
      );

      setSelectedIds([]);
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="history_action_bar">
          <p>{selectedIds.length} selected</p>
          <button className="btn btn-secondary" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      {history.map((item, index) => (
        <div
          className={`history_box ${selectedIds.includes(item.id) ? "selected" : ""}`}
          key={item.id}
        >
          <div className="single_history">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectedIds.includes(item.id)}
                onChange={() => handleCheckbox(item.id)}
              />
            </div>

            <div className="history_details">
              <p>
                <strong>{index + 1}.</strong> {item.target}
              </p>
              {item.created_at && (
                <span className="history_time">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              )}
            </div>

            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="history_icon"
            />
          </div>
        </div>
      ))}
    </>
  );
}
