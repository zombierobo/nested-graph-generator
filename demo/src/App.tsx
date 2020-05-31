import React from 'react';
import './App.css';
import { CompoundGraphPage } from './compound-graph-page';
import logo from './logo.svg';

function App() {
  return (
    <div className="main">
      <header className="header">
        <a className="app-name" href="/">
          <img alt="Logo" src={logo} />
          Nested Graph Generator
        </a>
      </header>
      <div className="content">
        <CompoundGraphPage />
      </div>
    </div>
  );
}

export default App;
