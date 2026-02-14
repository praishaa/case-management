import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setCases, setFilter } from "../redux/caseSlice";

import API from "../services/api";

export default function Dashboard() {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cases = useSelector((state) => state.cases.caseList);
  const filterStatus = useSelector((state) => state.cases.filterStatus);

  // ⭐ Bonus Feature → Search
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await API.get("/cases");
      dispatch(setCases(res.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // ⭐ Filtering + Search Combined
  const filteredCases = cases.filter((caseItem) => {
    const matchesStatus =
      filterStatus === "All" || caseItem.status === filterStatus;

    const matchesSearch = caseItem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>{currentUser?.email}</p>
          <p>Role: {role}</p>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        {role === "admin" && (
          <button
            style={styles.createBtn}
            onClick={() => navigate("/create-case")}
          >
            + Create Case
          </button>
        )}

        {/* Status Filter */}
        <select
          style={styles.select}
          value={filterStatus}
          onChange={(e) => dispatch(setFilter(e.target.value))}
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        {/* ⭐ Search */}
        <input
          style={styles.search}
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Case Count */}
      <p style={{ marginTop: "10px" }}>
        Showing {filteredCases.length} of {cases.length} cases
      </p>

      {/* Case List */}
      <div style={styles.caseGrid}>
        {filteredCases.length === 0 && <p>No cases found</p>}

        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            style={styles.card}
            onClick={() => navigate(`/case/${caseItem.id}`)}
          >
            <h3>{caseItem.title}</h3>

            <p>
              Status: <strong>{caseItem.status}</strong>
            </p>
            <p>Created By: {caseItem.createdBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ⭐ Styling */

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1000px",
    margin: "auto",
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  controls: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  createBtn: {
    padding: "8px 15px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "8px 15px",
    background: "#f44336",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  select: {
    padding: "8px",
  },

  search: {
    padding: "8px",
    minWidth: "200px",
  },

  caseGrid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },

  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#fafafa",
    transition: "0.2s",
  },
};
