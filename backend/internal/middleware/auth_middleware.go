package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(JWTSecret string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString := ctx.GetHeader("Authorization")
		if tokenString == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"message": "authorization token not found"})
			ctx.Abort()
			return
		}

		onlyToken := strings.Replace(tokenString, "Bearer ", "", 1)

		token, err := jwt.Parse(onlyToken, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(JWTSecret), nil
		})

		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token:", "message": err.Error()})
			ctx.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if exp, ok := claims["exp"].(float64); ok {
				expirationTime := time.Unix(int64(exp), 0)
				if time.Now().After(expirationTime) {
					ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
					ctx.Abort()
					return
				}
			}

			ctx.Set("userID", claims["sub"])
			ctx.Set("userEmail", claims["email"])
		}

		ctx.Next()
	}
}
