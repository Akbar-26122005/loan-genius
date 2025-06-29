import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Auth from './pages/auth';
import Profile from './pages/profile';
import Products from './pages/products'
import MyBank from './pages/mybank/mybank';
import Employee from './pages/employee';
import Loading from './components/loading';
import { Page404 } from './pages/displayOnly'

import { MessageSystem} from './components/messages';
import { UserProvider } from './config/userContext';
import { ProtectedUserRoute, ProtectedEmployeeRoute } from './config/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <UserProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* The public routes */}
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={ <Auth /> } />

            {/* The private routes */}
            <Route element={ <ProtectedUserRoute /> }>
              <Route path='/mybank' element={ <MyBank /> } />
              <Route path='/profile' element={ <Profile /> } />
              <Route path='/products' element={ <Products /> } />
            </Route>
            <Route element={ <ProtectedEmployeeRoute /> }>
              <Route path='/employee' element={ <Employee /> } />
            </Route>
            <Route path='/loading' element={ <Loading /> } />
            <Route path='*' element={ <Page404 /> } />
            </Routes>
        </Router>
        <MessageSystem />
      </div>
    </UserProvider>
  );
}