import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Auth from './pages/auth';
import Profile from './pages/profile';
import Products from './pages/products'
import Error404 from './pages/page404';
import ControlPanel from './components/controlPanel';
import Credits from './pages/credits'
import Loan from './pages/loan'
import getPath from './config/serverClient';
import { MessageSystem } from './components/messages';
import FloatingMenu from './components/floatingMenu';

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
      {
        !window.location.href.endsWith('/')
        && !window.location.href.endsWith('/auth')
        && <FloatingMenu />
      }
    </div>
  );
}

export default App;