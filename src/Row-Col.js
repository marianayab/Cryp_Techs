function createMatrix(text, rows, columns) {
    let matrix = [];
    let index = 0;
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < columns; j++) {
        if (index < text.length) {
          matrix[i][j] = text.charAt(index);
          index++;
        } else {
          matrix[i][j] = 'X'; // Padding with 'X'
        }
      }
    }
    return matrix;
  }
  
  function getKeyOrder(key) {
    let keyArr = key.split('');
    let sortedKeyArr = keyArr.slice().sort();
    let keyOrder = keyArr.map(char => sortedKeyArr.indexOf(char));
    return keyOrder;
  }
  
  function encryptTranspositionCipher(plaintext, key) {
    let columns = key.length;
    let rows = Math.ceil(plaintext.length / columns);
  
    let matrix = createMatrix(plaintext, rows, columns);
    let keyOrder = getKeyOrder(key);
  
    let ciphertext = '';
    for (let i = 0; i < columns; i++) {
      let k = keyOrder.indexOf(i);
      for (let row = 0; row < rows; row++) {
        ciphertext += matrix[row][k];
      }
    }
  
    return ciphertext;
  }
  
  function decryptTranspositionCipher(ciphertext, key) {
    let columns = key.length;
    let rows = Math.ceil(ciphertext.length / columns);
  
    let matrix = createMatrix('', rows, columns);
    let keyOrder = getKeyOrder(key);
  
    let index = 0;
    for (let i = 0; i < columns; i++) {
      let k = keyOrder.indexOf(i);
      for (let row = 0; row < rows; row++) {
        matrix[row][k] = ciphertext.charAt(index);
        index++;
      }
    }
  
    let plaintext = '';
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        plaintext += matrix[i][j];
      }
    }
  
    return plaintext;
  }
  
  // Function to handle encryption and decryption using given arguments
  function transpositionCipher(plaintext, key) {
    let formattedPlaintext = plaintext.replace(/\s+/g, '').toUpperCase();
  
    let ciphertext = encryptTranspositionCipher(formattedPlaintext, key);
    console.log("Ciphertext:", ciphertext);
  
    let decryptedText = decryptTranspositionCipher(ciphertext, key);
    console.log("Decrypted Text:", decryptedText);
  }
  
  // Example usage:
  let plaintext = "We are discovered flee at once";
  let key = "ZEBRAS";
  transpositionCipher(plaintext, key);
  
  