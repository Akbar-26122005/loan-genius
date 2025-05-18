import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Auth from './components/auth';
import Error404 from './components/page404';

function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' Component={Home} />
          <Route path='/login' Component={Auth} />
          <Route path='*' Component={Error404} />
        </Routes>
    </Router>
  );
}

export default App;