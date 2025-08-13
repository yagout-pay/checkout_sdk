package crypto

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"encoding/base64"
	"errors"
)

// Encrypt takes a Base64-encoded plaintext, AES-256-CBC encrypts it, and returns Base64 ciphertext.
func Encrypt(base64Text string, base64Key string) (string, error) {
	// Decode Base64 key
	keyBytes, err := base64.StdEncoding.DecodeString(base64Key)
	if err != nil {
		return "", err
	}
	if len(keyBytes) != 32 {
		return "", errors.New("invalid key length: must be 32 bytes after Base64 decoding")
	}

	// Decode Base64 plaintext
	plainBytes, err := base64.StdEncoding.DecodeString(base64Text)
	if err != nil {
		return "", err
	}

	// Create cipher block
	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return "", err
	}

	iv := []byte("0123456789abcdef") // Fixed IV for compatibility (not secure in production)

	// PKCS#7 padding
	blockSize := block.BlockSize()
	pad := blockSize - (len(plainBytes) % blockSize)
	padText := bytes.Repeat([]byte{byte(pad)}, pad)
	plaintext := append(plainBytes, padText...)

	// CBC mode encryption
	mode := cipher.NewCBCEncrypter(block, iv)
	ciphertext := make([]byte, len(plaintext))
	mode.CryptBlocks(ciphertext, plaintext)

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// Decrypt takes Base64 ciphertext, decrypts with AES-256-CBC, and returns Base64-encoded plaintext.
func Decrypt(base64Crypt string, base64Key string) (string, error) {
	// Decode Base64 key
	keyBytes, err := base64.StdEncoding.DecodeString(base64Key)
	if err != nil {
		return "", err
	}
	if len(keyBytes) != 32 {
		return "", errors.New("invalid key length: must be 32 bytes after Base64 decoding")
	}

	// Decode Base64 ciphertext
	ciphertext, err := base64.StdEncoding.DecodeString(base64Crypt)
	if err != nil {
		return "", err
	}

	// Create cipher block
	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return "", err
	}

	iv := []byte("0123456789abcdef")

	// CBC mode decryption
	mode := cipher.NewCBCDecrypter(block, iv)
	plaintext := make([]byte, len(ciphertext))
	mode.CryptBlocks(plaintext, ciphertext)

	// Remove PKCS#7 padding
	pad := int(plaintext[len(plaintext)-1])
	if pad == 0 || pad > aes.BlockSize || pad > len(plaintext) {
		return "", errors.New("invalid padding")
	}
	for i := len(plaintext) - pad; i < len(plaintext); i++ {
		if plaintext[i] != byte(pad) {
			return "", errors.New("invalid padding")
		}
	}

	// Return plaintext as Base64 again
	return base64.StdEncoding.EncodeToString(plaintext[:len(plaintext)-pad]), nil
}

// GenerateHash creates a SHA256 hash of meID|merchantRequest and returns it in Base64.
func GenerateHash(meID, merchantRequest string) string {
	hash := sha256.New()
	hash.Write([]byte(meID + "|" + merchantRequest))
	return base64.StdEncoding.EncodeToString(hash.Sum(nil))
}

