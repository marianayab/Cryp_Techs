function railFenceEncrypt(plaintext, numRails) {
    if (numRails <= 1) return plaintext; // No encryption needed if there is only one rail or less
  
    let railFence = Array.from({ length: numRails }, () => []);
    let rail = 0;
    let direction = 1; // 1 means moving down, -1 means moving up
  
    for (let char of plaintext) {
      railFence[rail].push(char);
      rail += direction;
  
      if (rail === 0 || rail === numRails - 1) {
        direction *= -1;
      }
    }
  
    return railFence.flat().join('');
  }
  
  function railFenceDecrypt(ciphertext, numRails) {
    if (numRails <= 1) return ciphertext; // No decryption needed if there is only one rail or less
  
    let railFence = Array.from({ length: numRails }, () => []);
    let railLengths = Array(numRails).fill(0);
    let rail = 0;
    let direction = 1; // 1 means moving down, -1 means moving up
  
    for (let i = 0; i < ciphertext.length; i++) {
      railLengths[rail]++;
      rail += direction;
  
      if (rail === 0 || rail === numRails - 1) {
        direction *= -1;
      }
    }
  
    let index = 0;
    for (let i = 0; i < numRails; i++) {
      railFence[i] = ciphertext.slice(index, index + railLengths[i]).split('');
      index += railLengths[i];
    }
  
    let plaintext = '';
    rail = 0;
    direction = 1;
  
    for (let i = 0; i < ciphertext.length; i++) {
      plaintext += railFence[rail].shift();
      rail += direction;
  
      if (rail === 0 || rail === numRails - 1) {
        direction *= -1;
      }
    }
  
    return plaintext;
  }
  
  // Input:
  let plaintext = "GOODMORNING";
  let depth = 2;
  let ciphertext = railFenceEncrypt(plaintext, depth);
  console.log("Ciphertext:", ciphertext); // Should output "GOMRIGODONNX"
  
  ciphertext = 'Horel ollWd';
  depth = 3;
  let decryptedText = railFenceDecrypt(ciphertext, depth);
  console.log("Decrypted Text:", decryptedText);
  