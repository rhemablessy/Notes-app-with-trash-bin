import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState("Personal");
  const [tab, setTab] = useState("active");

  const fetchNotes = async () => {
    const url =
      tab === "active"
        ? "http://localhost:5000/notes"
        : "http://localhost:5000/notes/trash";

    const response = await fetch(url);
    const data = await response.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, [tab]);

  const addNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content");
      return;
    }

    await fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        folder,
      }),
    });

    setTitle("");
    setContent("");
    setFolder("Personal");

    fetchNotes();
  };

  const toggleDelete = async (id) => {
    await fetch(`http://localhost:5000/notes/${id}`, {
      method: "PATCH",
    });

    fetchNotes();
  };

  const emptyTrash = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to empty trash?"
    );

    if (!confirmDelete) return;

    await fetch("http://localhost:5000/notes/trash", {
      method: "DELETE",
    });

    fetchNotes();
  };

  return (
    <div className="container">
      <h1 className="title">📝 Notes App</h1>

      {/* Form Section */}
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        >
          <option>Personal</option>
          <option>Work</option>
          <option>Study</option>
        </select>

        <button className="add-btn" onClick={addNote}>
          Add Note
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={
            tab === "active"
              ? "tab-btn active-tab"
              : "tab-btn"
          }
          onClick={() => setTab("active")}
        >
          Active Notes
        </button>

        <button
          className={
            tab === "deleted"
              ? "tab-btn active-tab"
              : "tab-btn"
          }
          onClick={() => setTab("deleted")}
        >
          Deleted Notes
        </button>
      </div>

      {/* Empty Trash Button */}
      {tab === "deleted" && (
        <button
          className="empty-trash-btn"
          onClick={emptyTrash}
        >
          Empty Trash
        </button>
      )}

      {/* Notes Section */}
      {notes.length === 0 ? (
        <div className="empty-state">
          No notes available.
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <span className="folder-badge">
                {note.folder}
              </span>

              <h3>{note.title}</h3>

              <p>{note.content}</p>

              <div className="note-actions">
                {tab === "active" ? (
                  <button
                    className="delete-btn"
                    onClick={() =>
                      toggleDelete(note.id)
                    }
                  >
                    Move to Trash
                  </button>
                ) : (
                  <button
                    className="restore-btn"
                    onClick={() =>
                      toggleDelete(note.id)
                    }
                  >
                    Restore Note
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}