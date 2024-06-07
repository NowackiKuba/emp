package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const secretKey = "supersecert"

func GenerateToken(email string, userId string) (string, error) { 
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"userId": userId,
		"exp": time.Now().Add(time.Hour * 2).Unix(),
	})

	return token.SignedString([]byte(secretKey))
}

func VerifyToken(token string) (string, error) { 
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok { 
			return "", errors.New("unexpected signing method")
		}
		return []byte(secretKey), nil
	}, )

	if err != nil { 
		return "", errors.New("could not parse token")
	}

	isTokenValid := parsedToken.Valid
	if !isTokenValid { 
		return "", errors.New("invalid token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)

	if !ok { 
		return "", errors.New("invalid token data")
	}

	// userId := strconv(claims["userId"].(float64))
	userId := string(claims["userId"].(string))

	return userId, nil
}