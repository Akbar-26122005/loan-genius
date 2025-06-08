import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Auth from './components/auth';
import Error404 from './components/page404';
import getPath from './config/serverClient';

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
          console.log(`response ok: ${response.ok}`)
          console.log(`status: ${response.status}`)
          console.log(`is authenticated: ${data.isAuthenticated}`)
          console.log(`message: ${data.message}`)
          throw new Error(data.message)
        }

        setUser(data.user)
      } catch (err) { }
      finally {
        setLoading(false)
        console.log(user)
      }
    }

    fetchData()
  }, [])

  return (
    loading ? null :
    <div>
      <Router>
        <Routes>
            <Route path='/' element={<Home user={ user } setUser={ setUser } />} />
            <Route path='/auth' element={<Auth user={ user } setUser={ setUser } />} />
            <Route path='*' element={<Error404 />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;