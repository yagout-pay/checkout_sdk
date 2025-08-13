package crypto

import (
    "bytes"
    "crypto/aes"
    "crypto/cipher"
    "crypto/sha256"
    "encoding/base64"
    "errors"
)

func Encrypt(text string, key string) (string, error) {
    keyBytes, err := base64.StdEncoding.DecodeString(key)
    if err != nil {
        return "", err
    }
    if len(keyBytes) != 32 {
        return "", errors.New("invalid key length")
    }

    block, err := aes.NewCipher(keyBytes)
    if err != nil {
        return "", err
    }

    iv := []byte("0123456789abcdef")

    blockSize := block.BlockSize()
    pad := blockSize - (len(text) % blockSize)
    padText := bytes.Repeat([]byte{byte(pad)}, pad)
    plaintext := append([]byte(text), padText...)

    mode := cipher.NewCBCEncrypter(block, iv)
    ciphertext := make([]byte, len(plaintext))
    mode.CryptBlocks(ciphertext, plaintext)

    return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func Decrypt(crypt string, key string) (string, error) {
    keyBytes, err := base64.StdEncoding.DecodeString(key)
    if err != nil {
        return "", err
    }

    ciphertext, err := base64.StdEncoding.DecodeString(crypt)
    if err != nil {
        return "", err
    }

    block, err := aes.NewCipher(keyBytes)
    if err != nil {
        return "", err
    }

    iv := []byte("0123456789abcdef")

    mode := cipher.NewCBCDecrypter(block, iv)
    plaintext := make([]byte, len(ciphertext))
    mode.CryptBlocks(plaintext, ciphertext)

    pad := int(plaintext[len(plaintext)-1])
    if pad == 0 || pad > aes.BlockSize || pad > len(plaintext) {
        return "", errors.New("invalid padding")
    }
    for i := len(plaintext) - pad; i < len(plaintext); i++ {
        if plaintext[i] != byte(pad) {
            return "", errors.New("invalid padding")
        }
    }
    return string(plaintext[:len(plaintext)-pad]), nil
}

func GenerateHash(meID, merchantRequest string) string {
    hash := sha256.New()
    hash.Write([]byte(meID + "|" + merchantRequest))
    return base64.StdEncoding.EncodeToString(hash.Sum(nil))
}
