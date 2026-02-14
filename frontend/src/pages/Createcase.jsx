import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CreateCase() {

  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");


  if (role !== "admin") {
    return <p>Access Denied</p>;
  }

  const handleCreateCase = async (e) => {
    e.preventDefault();

    try {

      await API.post("/cases", {
        title,
        description,
        status,
        createdBy: currentUser.email,
        createdAt: new Date()
      });

      alert("Case created successfully");

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create New Case</h1>

      <form onSubmit={handleCreateCase}>

        <input
          type="text"
          placeholder="Case Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Case Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>

        <br /><br />

        <button type="submit">
          Create Case
        </button>

      </form>
    </div>
  );
}
