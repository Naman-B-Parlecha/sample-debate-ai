package routes

import (
	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/config"
	handler "github.com/Naman-B-Parlecha/sample-debate-ai/internal/handlers"
	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/services"
	"github.com/Naman-B-Parlecha/sample-debate-ai/pkg/supabase"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, cfg *config.Config) {

	supabaseClient := supabase.NewSupabaseClient(cfg)

	authServices := services.NewAuthService(supabaseClient)
	authHandler := handler.NewAuthHandler(authServices)

	authGroup := r.Group("auth")

	authGroup.POST("/register", authHandler.RegisterUser)
	authGroup.POST("/login", authHandler.LoginUser)
}
