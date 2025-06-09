import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Auth from './components/auth';
import Profile from './components/profile';
import Products from './components/products'
import Error404 from './components/page404';
import ControlPanel from './components/controlPanel';
import Credits from './components/credits'
import Loan from './components/loan'
import getPath from './config/serverClient';
import { MessageSystem } from './components/messages';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getPath('/auth/check'), {
          method: 'GET'
          ,headers: {
            'Content-Type': 'application/json'
          }
          ,credentials: 'include'
        })

        const data = await response.json()

        if (!response.ok || !data.isAuthenticated) {
          throw new Error(data.message)
        }

        setUser(data.user)
      } catch (err) { }
      finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return null

  return (
    <div className="App">
      <header>
        <div className="container">
          <h1 id='main-headline'>Loan genius</h1>
        </div>
        <nav>
          <ControlPanel user={ user } />
        </nav>
      </header>

      <Router>
        <Routes>
            <Route path='/' element={<Home user={ user } setUser={ setUser } />} />
            <Route path='/auth' element={<Auth user={ user } setUser={ setUser } />} />
            <Route path='/profile' element={ <Profile user={ user } /> } />
            <Route path='/products' element={ <Products user={ user } /> } />
            <Route path='/credits' element={ <Credits user={ user } /> } />
            <Route path='/loan/:id' element={ <Loan  /> } />
            <Route path='*' element={<Error404 />} />
          </Routes>
      </Router>

      <MessageSystem />
    </div>
  );
}

export default App;