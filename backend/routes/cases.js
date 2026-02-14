const express = require("express");
const router = express.Router();
const db = require("../firebaseAdmin"); // 🔥 import Firestore

// ✅ GET all cases
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("cases").get();

    const cases = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST create a case
router.post("/", async (req, res) => {
  try {
    const newCase = req.body;

    const docRef = await db.collection("cases").add(newCase);

    res.json({
      message: "Case created successfully",
      id: docRef.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ PUT update a case
router.put("/:id", async (req, res) => {
  try {
    await db.collection("cases").doc(req.params.id).update(req.body);

    res.json({ message: "Case updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE a case
router.delete("/:id", async (req, res) => {
  try {
    await db.collection("cases").doc(req.params.id).delete();

    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
