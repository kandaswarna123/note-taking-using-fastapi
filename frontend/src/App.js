import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AddNote from './components/addnote';
import ViewNotes from './components/viewnotes';
import FullNote from './components/fullnote';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Router>
      <div className="App">
        <h1>Note App</h1>
        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                />
              ) : (
                <Navigate to="/ViewNotes" />
              )
            }
          />
          <Route
            path="/signup"
            element={<Signup setUsername={setUsername} setPassword={setPassword} />}
          />
          <Route
            path="/ViewNotes"
            element={
              isLoggedIn ? (
                <ViewNotes username={username} password={password} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/AddNote"
            element={
              isLoggedIn ? (
                <AddNote username={username} password={password} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route 
            path="/notes/:noteId" 
            element={
              isLoggedIn ? (
                <FullNote username={username} password={password} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;