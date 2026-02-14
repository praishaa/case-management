const express = require("express");
const router = express.Router();
const db = require("../firebaseAdmin");

// ⭐ Add Comment
router.post("/", async (req, res) => {
  try {
    const comment = req.body;

    const docRef = await db.collection("comments").add(comment);

    res.json({ id: docRef.id });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// ⭐ Get Comments By Case
router.get("/:caseId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("comments")
      .where("caseId", "==", req.params.caseId)
      .get();

    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(comments);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
