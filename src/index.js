import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import App from './components/App.js';
import { BrowserRouter } from 'react-router-dom'
import '@babel/polyfill'
import style from './styles/style.css';
ReactDOM.render(
  <BrowserRouter>
  <App />
  </BrowserRouter>
  , document.getElementById('root'));
