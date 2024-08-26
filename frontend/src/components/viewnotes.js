import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './viewnotes.css';

function ViewNotes({ username, password }) {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

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

  const handleAddNote = () => {
    navigate('/AddNote');
  };

  return (
    <div className="view-notes-container">
      <h2>Your Notes</h2>
      <button onClick={handleAddNote}>Add New Note</button>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewNotes;