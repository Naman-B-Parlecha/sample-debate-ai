package handler

import (
	"net/http"

	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/services"
	"github.com/Naman-B-Parlecha/sample-debate-ai/models"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) RegisterUser(ctx *gin.Context) {
	var user models.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Payload",
		})
		return
	}

	if err := h.authService.RegisterUser(&user); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to register user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully registered new user"})
}

func (h *AuthHandler) LoginUser(ctx *gin.Context) {
	var user models.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Payload",
		})
		return
	}
	authToken, err := h.authService.LoginUser(&user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Invalid Credentials"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"accessToken": authToken})

}
