const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let notes = [];

app.get("/notes", (req, res) => {
  res.json(notes.filter(note => !note.isDeleted));
});

app.get("/notes/trash", (req, res) => {
  res.json(notes.filter(note => note.isDeleted));
});

app.post("/notes", (req, res) => {
  const note = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    folder: req.body.folder,
    isDeleted: false,
  };

  notes.push(note);
  res.json(note);
});

app.patch("/notes/:id", (req, res) => {
  const note = notes.find(
    n => n.id == req.params.id
  );

  if (!note) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  note.isDeleted = !note.isDeleted;
  res.json(note);
});

app.delete("/notes/trash", (req, res) => {
  notes = notes.filter(
    note => !note.isDeleted
  );

  res.json({
    message: "Trash emptied successfully",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});