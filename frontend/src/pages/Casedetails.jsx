import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function CaseDetails() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    fetchCase();
    fetchComments();
  }, []);

  const fetchCase = async () => {
    const res = await API.get("/cases");
    const foundCase = res.data.find((c) => c.id === caseId);

    if (foundCase) {
      setCaseData(foundCase);
      setEditedTitle(foundCase.title);
      setEditedDescription(foundCase.description);
    }
  };

  const fetchComments = async () => {
    const res = await API.get(`/comments/${caseId}`);
    setComments(res.data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await API.post("/comments", {
      caseId,
      text: newComment,
      createdBy: currentUser.email,
      createdAt: new Date(),
    });

    setNewComment("");
    fetchComments();
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    await API.put(`/cases/${caseId}`, {
      status: newStatus,
    });

    setCaseData({ ...caseData, status: newStatus });
  };

  const handleSaveEdit = async () => {
    await API.put(`/cases/${caseId}`, {
      title: editedTitle,
      description: editedDescription,
    });

    setCaseData({
      ...caseData,
      title: editedTitle,
      description: editedDescription,
    });

    setIsEditing(false);
  };

  const handleDeleteCase = async () => {
    if (!window.confirm("Delete this case?")) return;

    await API.delete(`/cases/${caseId}`);
    alert("Case deleted");
    navigate("/dashboard");
  };

  if (!caseData) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      
      <div style={styles.card}>
        {isEditing ? (
          <input
            style={styles.input}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        ) : (
          <h2>{caseData.title}</h2>
        )}

        {isEditing ? (
          <textarea
            style={styles.textarea}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        ) : (
          <p>{caseData.description}</p>
        )}

        <p>
          <strong>Status:</strong>{" "}
          {role === "admin" ? (
            <select
              style={styles.select}
              value={caseData.status}
              onChange={handleStatusChange}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          ) : (
            caseData.status
          )}
        </p>

        <p>
          <strong>Created By:</strong> {caseData.createdBy}
        </p>

        {role === "admin" && (
          <div style={styles.adminControls}>
            {!isEditing ? (
              <button style={styles.editBtn} onClick={() => setIsEditing(true)}>
                Edit
              </button>
            ) : (
              <button style={styles.saveBtn} onClick={handleSaveEdit}>
                Save
              </button>
            )}

            <button style={styles.deleteBtn} onClick={handleDeleteCase}>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div style={styles.card}>
        <h3>Comments</h3>

        {comments.length === 0 && <p>No comments yet</p>}

        {comments.map((comment) => (
          <div key={comment.id} style={styles.comment}>
            <p>{comment.text}</p>
            <small>By: {comment.createdBy}</small>
          </div>
        ))}

        <textarea
          style={styles.textarea}
          placeholder="Write comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button style={styles.addCommentBtn} onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
}



const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "30px",
    fontFamily: "Arial",
  },

  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
    background: "#fafafa",
  },

  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },

  textarea: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
  },

  select: {
    padding: "6px",
  },

  adminControls: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },

  editBtn: {
    background: "#2196F3",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },

  saveBtn: {
    background: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },

  comment: {
    borderBottom: "1px solid #ddd",
    padding: "10px 0",
  },

  addCommentBtn: {
    marginTop: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer",
  },

  backBtn: {
    background: "#555",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },
};
