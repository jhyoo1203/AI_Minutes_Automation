import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Main from './components/contents/main/main';
import Minutes from './components/contents/minutes/minutes';
import MyMinutes from './components/contents/my_minutes/myMinutes';

function App() {
    return (
      <Router>
        <div className="flex w-full mx-auto bg-white">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/minutes" element={<Minutes />} />
            <Route path="/myMinutes" element={<MyMinutes />} />
          </Routes>
        </div>
      </Router>
    );
}

export default App;
