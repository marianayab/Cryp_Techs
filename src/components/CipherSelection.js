import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CipherSelection = ({ onCipherSelect }) => {
  const [cipher, setCipher] = useState('caesar');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onCipherSelect(cipher);
    navigate('/exchange');
  };
  

  return (
    <div className='main'>
      <h1 style={{ textAlign: 'center', color:'#9557b1' }}>Select Cipher</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ textAlign: 'center' }}>
          Cipher:
          <select value={cipher} onChange={(e) => setCipher(e.target.value)} style={{ marginLeft: '15px' }}>
            <option value="caesar" style={{fontWeight:'bold'}}>Lab 01: Caesar Cipher</option>
            <option value="vigenere" style={{fontWeight:'bold'}}>Lab 02: Vigenere Cipher</option>
            <option value="otp" style={{fontWeight:'bold'}}>Lab 03: OTP Cipher</option>
            <option value="hill" style={{fontWeight:'bold'}}>Lab 04: Hill Cipher</option>
            <option value="transposition" style={{fontWeight:'bold'}}>Lab 05: Rw-Col.TPosition </option>
            <option value="playfair" style={{fontWeight:'bold'}}>Lab 06: Playfair Cipher</option>
            <option value="railfence"style={{fontWeight:'bold'}}>Lab 07: RailFence Cipher</option>
          </select>
        </label>
        <button type="submit" style={{background: 'linear-gradient(45deg, #c694dc, #546697)', borderRadius: '3px'}}>Submit</button>
      </form>
    </div>
  );
};

export default CipherSelection;

