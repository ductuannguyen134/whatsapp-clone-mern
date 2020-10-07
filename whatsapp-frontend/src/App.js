import React, {useEffect, useState} from 'react';
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';
import Login from './components/Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useStateValue } from './StateProvider';

function App() {

  const [{user},dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ): (
        <div  className="app__body">
      <Router>
        <Sidebar />
        <Switch>  
          <Route path="/rooms/:roomID">           
            <Chat />
          </Route>
          <Route path="/">           
            <Chat />
          </Route>
        </Switch>
      </Router>
      </div>
      )}
    </div>
  );
}

export default App;
