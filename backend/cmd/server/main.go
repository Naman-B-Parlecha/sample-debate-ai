package main

import (
	"time"

	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/config"
	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "PATCH", "PUT"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.SetupRoutes(r, &cfg)
	r.Run(":" + cfg.ServerPort)
}
