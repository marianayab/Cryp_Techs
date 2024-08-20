// src/components/CipherSelection.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CipherSelection = ({ onCipherSelect }) => {
  const [cipher, setCipher] = useState('caesar');
  const [keyType, setKeyType] = useState('user');
  const [userKey, setUserKey] = useState('');
  const [hillKeyMatrix, setHillKeyMatrix] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let key;
    if (cipher === 'hill') {
      key = parseHillKeyMatrix(hillKeyMatrix);
    } else {
      key = cipher === 'otp' ? '' : keyType === 'user' ? userKey : generateRandomKey();
    }
    onCipherSelect(cipher, key);
    navigate('/exchange');
  };

  const parseHillKeyMatrix = (inputMatrix) => {
    const entries = inputMatrix.split(',').map(entry => parseInt(entry.trim(), 10));
    if (entries.length !== 9) {
      alert('Invalid Hill cipher key matrix. Please enter 9 numbers separated by commas.');
      return null;
    }
    const keyMatrix = [
      [entries[0], entries[1], entries[2]],
      [entries[3], entries[4], entries[5]],
      [entries[6], entries[7], entries[8]]
    ];
    return keyMatrix;
  };

  const generateRandomKey = (length = 100) => {
    let key = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Select Cipher</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ textAlign: 'center' }}>
          Cipher:
          <select value={cipher} onChange={(e) => setCipher(e.target.value)} style={{ marginLeft: '15px' }}>
            <option value="caesar">Caesar</option>
            <option value="vigenere">Vigenere</option>
            <option value="otp">One-Time Pad</option>
            <option value="hill">Hill Cipher</option>
          </select>
        </label>
        {cipher === 'hill' && (
          <div>
            <label>
              Enter 3x3 Key Matrix (comma-separated):
              <input
                type="text"
                value={hillKeyMatrix}
                onChange={(e) => setHillKeyMatrix(e.target.value)}
                placeholder="17,17,5,21,18,21,2,2,19"
                style={{ marginLeft: '15px' }}
              />
            </label>
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CipherSelection;
