function generatePlayfairKeyMatrix(key) {
  key = key.toUpperCase().replace(/J/g, 'I');
  let matrix = [];
  let seen = new Set();

  for (let char of key) {
    if (!seen.has(char)) {
      seen.add(char);
      matrix.push(char);
    }
  }

  for (let charCode = 65; charCode <= 90; charCode++) {
    let char = String.fromCharCode(charCode);
    if (char === 'J') continue;
    if (!seen.has(char)) {
      seen.add(char);
      matrix.push(char);
    }
  }

  let keyMatrix = [];
  for (let i = 0; i < 5; i++) {
    keyMatrix.push(matrix.slice(i * 5, i * 5 + 5));
  }

  return keyMatrix;
}

function findPosition(matrix, char) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) {
        return [i, j];
      }
    }
  }
  return null;
}

function processDigraph(matrix, char1, char2, encrypt = true) {
  let pos1 = findPosition(matrix, char1);
  let pos2 = findPosition(matrix, char2);

  if (pos1[0] === pos2[0]) {
    return matrix[pos1[0]][(pos1[1] + (encrypt ? 1 : 4)) % 5] + matrix[pos2[0]][(pos2[1] + (encrypt ? 1 : 4)) % 5];
  } else if (pos1[1] === pos2[1]) {
    return matrix[(pos1[0] + (encrypt ? 1 : 4)) % 5][pos1[1]] + matrix[(pos2[0] + (encrypt ? 1 : 4)) % 5][pos2[1]];
  } else {
    return matrix[pos1[0]][pos2[1]] + matrix[pos2[0]][pos1[1]];
  }
}

function prepareText(text) {
  text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let result = '';
  for (let i = 0; i < text.length; i += 2) {
    let char1 = text[i];
    let char2 = i + 1 < text.length ? text[i + 1] : 'X';
    if (char1 === char2) {
      result += char1 + 'X';
      i--;
    } else {
      result += char1 + char2;
    }
  }
  return result;
}

function playfairEncrypt(plaintext, key) {
  let keyMatrix = generatePlayfairKeyMatrix(key);
  plaintext = prepareText(plaintext);
  let ciphertext = '';
  for (let i = 0; i < plaintext.length; i += 2) {
    ciphertext += processDigraph(keyMatrix, plaintext[i], plaintext[i + 1]);
  }
  return ciphertext;
}

function playfairDecrypt(ciphertext, key) {
  let keyMatrix = generatePlayfairKeyMatrix(key);
  let plaintext = '';
  for (let i = 0; i < ciphertext.length; i += 2) {
    plaintext += processDigraph(keyMatrix, ciphertext[i], ciphertext[i + 1], false);
  }
  return plaintext;
}



// Input
let plaintext = "instruments";
let key = "MONARCHY";
let ciphertext = playfairEncrypt(plaintext, key);
console.log("Ciphertext:", ciphertext); 

let decryptedText = playfairDecrypt(ciphertext, key);
console.log("Decrypted Text:", decryptedText); 

  