package routes

import (
	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/config"
	handler "github.com/Naman-B-Parlecha/sample-debate-ai/internal/handlers"
	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/middleware"
	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/services"
	"github.com/Naman-B-Parlecha/sample-debate-ai/pkg/supabase"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, cfg *config.Config) {

	supabaseClient := supabase.NewSupabaseClient(cfg)
	HF_APIkey := cfg.HF_ApiKey
	OPEN_ROUTER_API := cfg.OPEN_ROUTER_API
	// this is for auth routes
	authServices := services.NewAuthService(supabaseClient)
	authHandler := handler.NewAuthHandler(authServices)

	authGroup := r.Group("auth")

	authGroup.POST("/register", authHandler.RegisterUser)
	authGroup.POST("/login", authHandler.LoginUser)

	// this is for Profile routes
	profileService := services.NewProfileServer(supabaseClient)
	profileHandler := handler.NewProfileHandler(profileService)

	profileGroup := r.Group("profile")
	profileGroup.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		profileGroup.GET("/", profileHandler.GetProfile)
		profileGroup.PUT("/", profileHandler.UpdateProfile)
	}

	// this is for debate routes
	debateService := services.NewDebateService(supabaseClient)
	debateHandler := handler.NewDebateHandler(debateService)

	debateGroup := r.Group("debate")

	debateGroup.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		debateGroup.POST("/", debateHandler.CreateDebate)
	}

	// this is for arguments routes
	argumentService := services.NewArgumentService(supabaseClient, HF_APIkey, OPEN_ROUTER_API)
	argumentsHandler := handler.NewArgumentsHandler(argumentService)

	argumentsGroup := r.Group("arguments")
	argumentsGroup.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		argumentsGroup.POST("/", argumentsHandler.GetArguments)
	}

	// this is for judge routes
	judgeService := services.NewJudgingService(supabaseClient, OPEN_ROUTER_API)
	judgeHandler := handler.NewJudgeHandler(judgeService)

	judgeGroup := r.Group("judge")
	judgeGroup.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		judgeGroup.POST("/", judgeHandler.GenerateScores)
	}
}
