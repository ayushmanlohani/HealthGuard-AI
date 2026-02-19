import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Simulator from './pages/Simulator';
import Download from './pages/Download';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </Router>
  );
}

export default App;