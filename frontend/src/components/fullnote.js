import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './fullnotes.css';
function FullNote({ username, password }) {
  const [note, setNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const { noteId } = useParams();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:8000',
  });

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const response = await api.get(`/notes/${noteId}`, {
        auth: { username, password },
      });
      setNote(response.data);
      setEditedTitle(response.data.title);
      setEditedContent(response.data.content);
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await api.put(`/notes/${noteId}`, { title: editedTitle, content: editedContent }, {
        auth: { username, password },
      });
      setIsEditing(false);
      fetchNote(); // Refresh the note data
    } catch (error) {
      console.error('Error editing note:', error);
      alert('Failed to edit note. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${noteId}`, {
        auth: { username, password },
      });
      navigate('/'); // Redirect to home page after deletion
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="full-note-container">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>{note.title}</h3>
          <p><strong>Author:</strong> {note.author}</p>
          <p>{note.content}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <button onClick={() => navigate('/')}>Back to Notes</button>
    </div>
  );
}

export default FullNote;