import React, { useState } from 'react';
import lock1 from './closed.png';
import lock2 from './open.png';
import key from './key.png';

const MessageExchange = ({ cipher, key: initialKey }) => {
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [useUserKey, setUseUserKey] = useState(false);
  const [userKey, setUserKey] = useState('');
  const [hillKeyMatrix, setHillKeyMatrix] = useState('');
  const [finalKey, setFinalKey] = useState(initialKey);
  const [railDepth, setRailDepth] = useState(2); // state for Rail Fence Cipher
  const [transpositionKey, setTranspositionKey] = useState('');

  const generateRandomKey = (length) => {
    let key = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  };

  const handleUserKeySelection = () => {
    if (useUserKey) {
      setFinalKey(userKey);
    } else {
      setFinalKey(generateRandomKey(message.length));
    }
  };

  const caesarCipher = (str, shift) => {
    return str.replace(/[a-z]/g, (c) => {
      return String.fromCharCode(((c.charCodeAt(0) - 97 + shift + 26) % 26) + 97);
    }).replace(/[A-Z]/g, (c) => {
      return String.fromCharCode(((c.charCodeAt(0) - 65 + shift + 26) % 26) + 65);
    });
  };

  const vigenereCipher = (str, key, decrypt = false) => {
    let result = '';
    key = key.toUpperCase();
    for (let i = 0, j = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
        const base = c >= 65 && c <= 90 ? 65 : 97;
        const keyShift = (key.charCodeAt(j % key.length) - 65) * (decrypt ? -1 : 1);
        result += String.fromCharCode((c - base + keyShift + 26) % 26 + base);
        j++;
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  };

  const otpCipher = (str, key, decrypt = false) => {
    let result = '';
    for (let i = 0, j = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
            const base = c >= 65 && c <= 90 ? 65 : 97;
            const keyShift = (key.charCodeAt(j % key.length) - base) * (decrypt ? -1 : 1);
            result += String.fromCharCode(((c - base + keyShift + 26) % 26) + base);
            j++;
        } else {
            result += str.charAt(i);
        }
    }
    return result;
};


const hillCipher = (str, keyMatrix) => {
  let result = '';
  let cleanedStr = str.replace(/[^A-Z]/gi, '');
  cleanedStr = cleanedStr.toUpperCase();

  // Padding with 'X' to make the length a multiple of 3
  while (cleanedStr.length % 3 !== 0) {
      cleanedStr += 'X';
  }

  for (let i = 0; i < cleanedStr.length; i += 3) {
      const block = cleanedStr.slice(i, i + 3);
      const vector = block.split('').map((char) => char.charCodeAt(0) - 65);

      // Hill cipher encryption using C = P * K approach
      const encryptedVector = [
          vector[0] * keyMatrix[0] + vector[1] * keyMatrix[1] + vector[2] * keyMatrix[2],
          vector[0] * keyMatrix[3] + vector[1] * keyMatrix[4] + vector[2] * keyMatrix[5],
          vector[0] * keyMatrix[6] + vector[1] * keyMatrix[7] + vector[2] * keyMatrix[8]
      ].map((val) => val % 26);

      result += String.fromCharCode(...encryptedVector.map((val) => val + 65));
  }

  // Merge encrypted result with non-alphabetic characters in original string
  let mergedResult = '';
  for (let i = 0, j = 0; i < str.length; i++) {
      if ((str[i] >= 'A' && str[i] <= 'Z') || (str[i] >= 'a' && str[i] <= 'z')) {
          mergedResult += result[j++];
      } else {
          mergedResult += str[i];
      }
  }
  return mergedResult;
};

const hillDecipher = (str, keyMatrix) => {
  let result = '';
  let cleanedStr = str.replace(/[^A-Z]/gi, '');
  cleanedStr = cleanedStr.toUpperCase();

  // Calculate the modular inverse of the determinant of the key matrix
  const det = keyMatrix[0] * (keyMatrix[4] * keyMatrix[8] - keyMatrix[5] * keyMatrix[7]) -
              keyMatrix[1] * (keyMatrix[3] * keyMatrix[8] - keyMatrix[5] * keyMatrix[6]) +
              keyMatrix[2] * (keyMatrix[3] * keyMatrix[7] - keyMatrix[4] * keyMatrix[6]);
  const detInv = modInverse(det, 26);

  // Calculate the inverse of the key matrix (for decryption)
  const inverseMatrix = [
      (keyMatrix[4] * keyMatrix[8] - keyMatrix[5] * keyMatrix[7]) * detInv % 26,
      (keyMatrix[2] * keyMatrix[7] - keyMatrix[1] * keyMatrix[8]) * detInv % 26,
      (keyMatrix[1] * keyMatrix[5] - keyMatrix[2] * keyMatrix[4]) * detInv % 26,
      (keyMatrix[5] * keyMatrix[6] - keyMatrix[3] * keyMatrix[8]) * detInv % 26,
      (keyMatrix[0] * keyMatrix[8] - keyMatrix[2] * keyMatrix[6]) * detInv % 26,
      (keyMatrix[2] * keyMatrix[3] - keyMatrix[0] * keyMatrix[5]) * detInv % 26,
      (keyMatrix[3] * keyMatrix[7] - keyMatrix[4] * keyMatrix[6]) * detInv % 26,
      (keyMatrix[1] * keyMatrix[6] - keyMatrix[0] * keyMatrix[7]) * detInv % 26,
      (keyMatrix[0] * keyMatrix[4] - keyMatrix[1] * keyMatrix[3]) * detInv % 26
  ].map((val) => (val + 26) % 26);

  for (let i = 0; i < cleanedStr.length; i += 3) {
      const block = cleanedStr.slice(i, i + 3);
      const vector = block.split('').map((char) => char.charCodeAt(0) - 65);

      // Hill cipher decryption using C = P * K approach
      const decryptedVector = [
          vector[0] * inverseMatrix[0] + vector[1] * inverseMatrix[1] + vector[2] * inverseMatrix[2],
          vector[0] * inverseMatrix[3] + vector[1] * inverseMatrix[4] + vector[2] * inverseMatrix[5],
          vector[0] * inverseMatrix[6] + vector[1] * inverseMatrix[7] + vector[2] * inverseMatrix[8]
      ].map((val) => (val % 26 + 26) % 26);

      result += String.fromCharCode(...decryptedVector.map((val) => val + 65));
  }

  // Merge decrypted result with non-alphabetic characters in original string
  let mergedResult = '';
  for (let i = 0, j = 0; i < str.length; i++) {
      if ((str[i] >= 'A' && str[i] <= 'Z') || (str[i] >= 'a' && str[i] <= 'z')) {
          mergedResult += result[j++];
      } else {
          mergedResult += str[i];
      }
  }
  return mergedResult;
};

const modInverse = (a, m) => {
  a = a % m;
  for (let x = -m; x < m; x++) {
      if ((a * x) % m === 1) {
          return x;
      }
  }
  return 1;
};


const playfairEncrypt = (str, key) => {
  const size = 5;
  const grid = generatePlayfairGrid(key);

  // Extract alphabetic characters for encryption
  let alphaStr = str.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';

  for (let i = 0; i < alphaStr.length; i += 2) {
      let a = alphaStr[i];
      let b = alphaStr[i + 1];
      if (b === undefined) {
          b = 'X';
      }
      if (a === b) {
          b = 'X';
      }
      const [row1, col1] = findPosition(grid, a);
      const [row2, col2] = findPosition(grid, b);
      if (row1 === row2) {
          result += grid[row1][(col1 + 1) % size] + grid[row2][(col2 + 1) % size];
      } else if (col1 === col2) {
          result += grid[(row1 + 1) % size][col1] + grid[(row2 + 1) % size][col2];
      } else {
          result += grid[row1][col2] + grid[row2][col1];
      }
  }

  // Merge encrypted result with original string, keeping non-alphabetic characters in place
  let mergedResult = '';
  for (let i = 0, j = 0; i < str.length; i++) {
      if ((str[i].toUpperCase() >= 'A' && str[i].toUpperCase() <= 'Z')) {
          mergedResult += result[j++];
      } else {
          mergedResult += str[i];
      }
  }
  return mergedResult;
};

const playfairDecrypt = (str, key) => {
  const size = 5;
  const grid = generatePlayfairGrid(key);

  // Extract alphabetic characters for decryption
  let alphaStr = str.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';

  for (let i = 0; i < alphaStr.length; i += 2) {
      let a = alphaStr[i];
      let b = alphaStr[i + 1];
      if (b === undefined) {
          b = 'X';
      }
      const [row1, col1] = findPosition(grid, a);
      const [row2, col2] = findPosition(grid, b);
      if (row1 === row2) {
          result += grid[row1][(col1 - 1 + size) % size] + grid[row2][(col2 - 1 + size) % size];
      } else if (col1 === col2) {
          result += grid[(row1 - 1 + size) % size][col1] + grid[(row2 - 1 + size) % size][col2];
      } else {
          result += grid[row1][col2] + grid[row2][col1];
      }
  }

  // Merge decrypted result with original string, keeping non-alphabetic characters in place
  let mergedResult = '';
  for (let i = 0, j = 0; i < str.length; i++) {
      if ((str[i].toUpperCase() >= 'A' && str[i].toUpperCase() <= 'Z')) {
          mergedResult += result[j++];
      } else {
          mergedResult += str[i];
      }
  }
  return mergedResult;
};

const generatePlayfairGrid = (key) => {
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
  const grid = [];
  const used = new Set();
  key = key.toUpperCase().replace(/J/g, 'I');
  for (const char of key + alphabet) {
      if (!used.has(char) && alphabet.includes(char)) {
          grid.push(char);
          used.add(char);
      }
  }
  return Array.from({ length: 5 }, (_, i) => grid.slice(i * 5, i * 5 + 5));
};

const findPosition = (grid, char) => {
  for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] === char) {
              return [row, col];
          }
      }
  }
  return [-1, -1];
};


const railFenceEncrypt = (str, key) => {
  if (key < 2) {
      alert("Depth key must be greater than 1.");
      return;
  }
  if (str.length < key + 2) {
      alert("Text length must be at least 2 units greater than the depth key length.");
      return;
  }

  const rail = Array.from({ length: key }, () => []);
  let direction = false;
  let row = 0;

  for (let i = 0; i < str.length; i++) {
      rail[row].push(str[i]);
      if (row === 0 || row === key - 1) {
          direction = !direction;
      }
      row += direction ? 1 : -1;
  }

  return rail.flat().join('');
};

const railFenceDecrypt = (str, key) => {
  if (key < 2) {
      alert("Depth key must be greater than 1.");
      return;
  }
  if (str.length < key + 2) {
      alert("Text length must be at least 2 units greater than the depth key length.");
      return;
  }

  const rail = Array.from({ length: key }, () => []);
  const marker = Array.from({ length: str.length }, () => false);
  let direction = false;
  let row = 0;

  for (let i = 0; i < str.length; i++) {
      rail[row].push('*');
      if (row === 0 || row === key - 1) {
          direction = !direction;
      }
      row += direction ? 1 : -1;
  }

  let idx = 0;
  for (let r = 0; r < key; r++) {
      for (let c = 0; c < rail[r].length; c++) {
          if (rail[r][c] === '*') {
              rail[r][c] = str[idx++];
          }
      }
  }

  let result = '';
  row = 0;
  direction = false;
  for (let i = 0; i < str.length; i++) {
      result += rail[row].shift();
      if (row === 0 || row === key - 1) {
          direction = !direction;
      }
      row += direction ? 1 : -1;
  }

  return result;
};


const createMatrix = (text, key, filler = 'X') => {
  const rows = Math.ceil(text.length / key.length);
  const matrix = Array.from({ length: rows }, () => Array(key.length).fill(filler));

  for (let i = 0; i < text.length; i++) {
    matrix[Math.floor(i / key.length)][i % key.length] = text[i];
  }

  return matrix;
};

const getKeyOrder = (key) => {
  return [...key].map((char, index) => ({ char, index }))
    .sort((a, b) => a.char.localeCompare(b.char))
    .map(({ index }) => index);
};

const encryptTranspositionCipher = (text, key) => {
  const matrix = createMatrix(text, key);
  const order = getKeyOrder(key);
  let result = '';

  for (const index of order) {
    for (const row of matrix) {
      result += row[index];
    }
  }

  return result;
};

const decryptTranspositionCipher = (text, key) => {
  const rows = Math.ceil(text.length / key.length);
  const matrix = Array.from({ length: rows }, () => Array(key.length).fill(''));
  const order = getKeyOrder(key);
  const colLength = Math.floor(text.length / key.length);
  const extraChars = text.length % key.length;
  let position = 0;

  for (const index of order) {
    const currentLength = index < extraChars ? colLength + 1 : colLength;
    for (let row = 0; row < currentLength; row++) {
      matrix[row][index] = text[position++];
    }
  }

  return matrix.flat().join('');
};

  const handleEncrypt = () => {
    let encrypted;
    switch (cipher) {
      case 'caesar':
        encrypted = caesarCipher(message, 3);
        break;
      case 'vigenere':
        if (!finalKey) {
          alert('Please confirm the key for Vigenere cipher.');
          return;
        }
        encrypted = vigenereCipher(message, finalKey);
        break;
      case 'otp':
        if (!finalKey) {
          alert('Please confirm the key for OTP cipher.');
          return;
        }
        if (finalKey.length !== message.length) {
          alert('The key length must be equal to the message length for OTP cipher.');
          return;
        }
        encrypted = otpCipher(message, finalKey);
        break;
      case 'hill':
        if (!hillKeyMatrix || hillKeyMatrix.trim().split(',').length !== 9) {
          alert('Please enter a valid Hill cipher key matrix. It should be exactly 9 comma-separated numbers.');
          return;
        }
        const keyMatrix = hillKeyMatrix.split(',').map(Number);
        encrypted = hillCipher(message, keyMatrix);
        break;
      case 'playfair':
        if (!finalKey) {
          alert('Please confirm the key for Playfair cipher.');
          return;
        }
        encrypted = playfairEncrypt(message, finalKey);
        break;
      case 'railfence':
        encrypted = railFenceEncrypt(message, railDepth);
        break;
        case 'transposition':
        encrypted = encryptTranspositionCipher(message, transpositionKey);
        break;
      default:
        encrypted = message;
    }
    setEncryptedMessage(encrypted);
  };

  const handleDecrypt = () => {
    let decrypted;
    switch (cipher) {
      case 'caesar':
        decrypted = caesarCipher(encryptedMessage, -3);
        break;
      case 'vigenere':
        if (!finalKey) {
          alert('Please confirm the key for Vigenere cipher.');
          return;
        }
        decrypted = vigenereCipher(encryptedMessage, finalKey, true);
        break;
      case 'otp':
        if (!finalKey) {
          alert('Please confirm the key for OTP cipher.');
          return;
        }
        if (finalKey.length !== encryptedMessage.length) {
          alert('The key length must be equal to the message length for OTP cipher.');
          return;
        }
        decrypted = otpCipher(encryptedMessage, finalKey, true);
        break;
      case 'hill':
        if (!hillKeyMatrix || hillKeyMatrix.trim().split(',').length !== 9) {
          alert('Please enter a valid Hill cipher key matrix. It should be exactly 9 comma-separated numbers.');
          return;
        }
        const keyMatrix = hillKeyMatrix.split(',').map(Number);
        decrypted = hillDecipher(encryptedMessage, keyMatrix);
        break;
      case 'playfair':
        if (!finalKey) {
          alert('Please confirm the key for Playfair cipher.');
          return;
        }
        decrypted = playfairDecrypt(encryptedMessage, finalKey);
        break;
      case 'railfence':
        decrypted = railFenceDecrypt(encryptedMessage, railDepth);
        break;
        case 'transposition':
          decrypted = decryptTranspositionCipher(encryptedMessage, transpositionKey);
          break;
      default:
        decrypted = encryptedMessage;
    }
    setDecryptedMessage(decrypted);
  };

  var headin = `${cipher} cipher`.toUpperCase();

  return (
    <div>
      <h1 style={{textAlign:'center'}}>{headin}</h1>
      {cipher === 'vigenere' && (
        <div>
          <label>
            Do you want to provide your own key?
            <select className='yes-no' value={useUserKey} style={{margin:'6px 0px 6px 6px'}} onChange={(e) => setUseUserKey(e.target.value === 'true')}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>
          {useUserKey && (
            <label>
              Key:
              <input
                type="text"
                value={userKey}
                onChange={(e) => setUserKey(e.target.value.toUpperCase())}
              />
            </label>
          )}
          <button onClick={handleUserKeySelection} style={{display:'flex', alignItems:'center', background: 'linear-gradient(45deg, #c694dc, #546697)', borderRadius: '3px', marginLeft: '3px'}} >Confirm Key <img style={{width:'18px', marginLeft:'5px'}} src={key}/> </button>
        </div>
      )}
      {cipher === 'otp' && (
        <div className='buttons'>
          <label>
            Do you want to provide your own key?
            <select className='yes-no' value={useUserKey} style={{margin:'6px 0px 6px 6px'}} onChange={(e) => setUseUserKey(e.target.value === 'true')}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>
          {useUserKey && (
            <label>
              Key:
              <input
                type="text"
                value={userKey}
                onChange={(e) => setUserKey(e.target.value.toUpperCase())}
              />
            </label>
          )}
          <button onClick={handleUserKeySelection} style={{display:'flex', alignItems:'center', background: 'linear-gradient(45deg, #c694dc, #546697)', borderRadius: '3px', marginLeft: '3px'}} >Confirm Key <img style={{width:'    18px', marginLeft:'5px'}} src={key}/> </button>
        </div>
      )}
      {cipher === 'playfair' && (
        <div>
          <label>
            Do you want to provide your own key?
            <select className='yes-no' style={{margin:'6px 0px 6px 6px'}} value={useUserKey} onChange={(e) => setUseUserKey(e.target.value === 'true')}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>
          {useUserKey && (
            <label>
              Key:
              <input
                type="text"
                value={userKey}
                onChange={(e) => setUserKey(e.target.value.toUpperCase())}
              />
            </label>
          )}
          <button onClick={handleUserKeySelection} style={{display:'flex', alignItems:'center', background: 'linear-gradient(45deg, #c694dc, #546697)', borderRadius: '3px', marginLeft: '3px'}} >Confirm Key <img style={{width:'18px', marginLeft:'5px'}} src={key}/> </button>
        </div>
      )}
      {cipher === 'hill' && (
        <div>
          <label>
            Hill Cipher Key Matrix (9 comma-separated numbers):
            <input
              type="text"
              value={hillKeyMatrix}
              onChange={(e) => setHillKeyMatrix(e.target.value)}
            />
          </label>
        </div>
      )}
      {cipher === 'railfence' && (
        <div>
          <label>
            Rail Fence Depth (number of rails):
            <input
              type="number"
              value={railDepth}
              onChange={(e) => setRailDepth(parseInt(e.target.value))}
            />
          </label>
        </div>
      )}
        {cipher === 'transposition' && (
        <div>
          <label>
            Transposition Key:
            <input type="text" value={transpositionKey} onChange={(e) => setTranspositionKey(e.target.value)} />
          </label>
        </div>
      )}
      <div>
        <h2>Encryption</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.toUpperCase())}
          placeholder="Enter message to encrypt"
          style={{ width: '100%', height: '100px' }}
        ></textarea>
        <br />
        <button onClick={handleEncrypt} style={{display:'flex', alignItems:'center', background: 'linear-gradient(45deg, #c694dc, #546697)', borderRadius: '3px'}}>Encrypt<img style={{width:'22px', marginLeft:'3px'}} src={lock1}/></button>
        <p><strong>Encrypted Message:</strong> {encryptedMessage}</p>
      </div>
      <div>
        <h2>Decryption</h2>
        <textarea
          value={encryptedMessage}
          onChange={(e) => setEncryptedMessage(e.target.value.toUpperCase())}
          placeholder="Enter message to decrypt"
          style={{ width: '100%', height: '100px' }}
        ></textarea>
        <br />
        <button onClick={handleDecrypt} style={{display:'flex', alignItems:'center', background: 'linear-gradient(45deg, #c694dc, #546697)', borderRadius: '3px'}}>Decrypt<img style={{width:'22px', marginLeft:'3px'}} src={lock2}/></button>
        <p><strong>Decrypted Message:</strong> {decryptedMessage}</p>
      </div>
    </div>
  );
};

export default MessageExchange;



