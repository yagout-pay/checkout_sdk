package crypto

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
)

func Encrypt(plainText string, base64Key string) (string, error) {
	key, err := base64.StdEncoding.DecodeString(base64Key)
	if err != nil {
		return "", fmt.Errorf("key decoding failed: %w", err)
	}
	if len(key) != 32 {
		return "", errors.New("key must be 32 bytes after decoding")
	}

	iv := []byte("0123456789abcdef")
	if len(iv) != aes.BlockSize {
		return "", fmt.Errorf("IV must be %d bytes", aes.BlockSize)
	}

	plainBytes := []byte(plainText)
	blockSize := aes.BlockSize
	padLen := blockSize - (len(plainBytes) % blockSize)
	padding := bytes.Repeat([]byte{byte(padLen)}, padLen)
	paddedPlaintext := append(plainBytes, padding...)

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("cipher creation failed: %w", err)
	}

	ciphertext := make([]byte, len(paddedPlaintext))
	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(ciphertext, paddedPlaintext)

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}



func GenerateHash(hashInput string, base64Key string) (string, error) {
    if hashInput == "" {
        return "", errors.New("hash input cannot be empty")
    }

    // hash using sha256 algorithm
    h := sha256.New()
    h.Write([]byte(hashInput))
    shaHex := fmt.Sprintf("%x", h.Sum(nil)) // hex string

    // Encrypt the hex string
    encrypted, err := Encrypt(shaHex, base64Key)
    if err != nil {
        return "", err
    }

    // Return encrypted hash
    return encrypted, nil
}



func Decrypt(base64Ciphertext string, base64Key string) (string, error) {
	key, err := base64.StdEncoding.DecodeString(base64Key)
	if err != nil {
		return "", fmt.Errorf("key decoding failed: %w", err)
	}

	ciphertext, err := base64.StdEncoding.DecodeString(base64Ciphertext)
	if err != nil {
		return "", fmt.Errorf("ciphertext decoding failed: %w", err)
	}

	iv := []byte("0123456789abcdef")

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("cipher creation failed: %w", err)
	}

	if len(ciphertext)%aes.BlockSize != 0 {
		return "", errors.New("ciphertext is not a multiple of block size")
	}

	mode := cipher.NewCBCDecrypter(block, iv)
	plaintext := make([]byte, len(ciphertext))
	mode.CryptBlocks(plaintext, ciphertext)

	padLen := int(plaintext[len(plaintext)-1])
	if padLen > len(plaintext) {
		return "", errors.New("invalid padding")
	}

	return string(plaintext[:len(plaintext)-padLen]), nil
}
