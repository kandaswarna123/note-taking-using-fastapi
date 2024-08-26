import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NotePage({ username, password }) {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:8000',
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes', {
        auth: { username, password },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notes', { title: noteTitle, content: noteContent }, {
        auth: { username, password },
      });
      setNoteTitle('');
      setNoteContent('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    }
  };

  const handleEditNote = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/notes/${editingNote.id}`, { title: noteTitle, content: noteContent }, {
        auth: { username, password },
      });
      setNoteTitle('');
      setNoteContent('');
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error editing note:', error);
      alert('Failed to edit note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`, {
        auth: { username, password },
      });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  return (
    <div className="notes-container">
      <h2>{editingNote ? 'Edit Note' : 'Add Note'}</h2>
      <form onSubmit={editingNote ? handleEditNote : handleAddNote} className="note-form">
        <input
          type="text"
          placeholder="Note Title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Note Content"
        />
        <button type="submit">{editingNote ? 'Save Changes' : 'Add Note'}</button>
        {editingNote && (
          <button type="button" onClick={() => setEditingNote(null)}>Cancel</button>
        )}
      </form>

      <h2>Your Notes</h2>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id} className="note-item">
            <h3>{note.title}</h3>
            <p><strong>Author:</strong> {note.author}</p>
            <p>{note.content}</p>
            <div className="note-actions">
              <button onClick={() => startEditing(note)}>Edit</button>
              <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotePage;
