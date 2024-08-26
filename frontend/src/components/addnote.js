import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './addnote.css';

function AddNote({ username, password }) {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:8000',
  });

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notes', { title: noteTitle, content: noteContent }, {
        auth: { username, password },
      });
      setNoteTitle('');
      setNoteContent('');
      navigate('/AddNote'); // Redirect to ViewNotes after adding a note
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    }
  };

  return (
    <div className="add-note-container">
      <h2>Add Note</h2>
      <form onSubmit={handleAddNote} className="note-form">
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
        <button type="submit">Add Note</button>
        {/* <button type="button" onClick={() => navigate('/ViewNotes')}>Cancel</button> */}
        <button type="button" onClick={() => navigate('/ViewNotes')}>view notes</button>
      </form>
    </div>
  );
}

export default AddNote;