import React/*, { useState }*/ from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Words from './components/Words';
import AddTranslationForm from './components/AddTranslationForm';

const App = () => {

  return (
    <div className="main-layout">
      <AddTranslationForm />
      <Words />
    </div>
  );
}

export default App;
