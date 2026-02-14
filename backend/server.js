const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ⭐ Test Route
app.get("/", (req, res) => {
  res.json({ message: "Backend server is running" });
});

// ⭐ API Routes
app.use("/api/cases", require("./routes/cases"));
app.use("/api/comments", require("./routes/comments")); // ADD THIS

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
