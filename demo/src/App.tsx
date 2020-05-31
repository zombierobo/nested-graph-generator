import React from 'react';
import './App.css';
import { CompoundGraphPage } from './compound-graph-page';

function App() {
  return (
    <div className="main">
      <header className="header">
        <a className="app-name" href="/">
          Random Graph Generator
        </a>
      </header>
      <div className="content">
        <CompoundGraphPage />
      </div>
    </div>
  );
}

export default App;
