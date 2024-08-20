// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CipherSelection from './components/CipherSelection';
import MessageExchange from './components/MessageExchange';
import './App.css'

function App ()  {
  const [cipher, setCipher] = useState('');
  const [key, setKey] = useState('');

  const handleCipherSelect = (selectedCipher, selectedKey) => {
    setCipher(selectedCipher);
    setKey(selectedKey);
  };

  return (

      <Routes>
        <Route path="/" element={<CipherSelection onCipherSelect={handleCipherSelect} />} />
        <Route path="/exchange" element={<MessageExchange cipher={cipher} key={key} />} />
      </Routes>

  );
}

export default App;
