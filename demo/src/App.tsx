import React from 'react';
import './App.css';
import { CompoundGraphPage } from './compound-graph-page';
import logo from './logo.svg';
import githubLogo from './github-logo.svg';

function App() {
  return (
    <div className="main">
      <header className="header">
        <a className="app-name remove-decoration" href="/">
          <img alt="Logo" src={logo} />
          Nested Graph Generator
        </a>
        <a className="github-repo-link remove-decoration" href="https://github.com/zombierobo/nested-graph-generator" target="__blank">
          <img alt="Github Logo" src={githubLogo} />
          Github
        </a>
      </header>
      <div className="content">
        <CompoundGraphPage />
      </div>
    </div>
  );
}

export default App;
