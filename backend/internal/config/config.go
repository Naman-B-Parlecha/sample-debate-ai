package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	SupabaseURL string
	SupabaseKey string
	JWTSecret   string
	ServerPort  string
	HF_ApiKey   string
}

func LoadConfig() Config {
	godotenv.Load()

	return Config{
		SupabaseURL: getEnv("SUPABASE_URL", ""),
		SupabaseKey: getEnv("SUPABASE_KEY", ""),
		JWTSecret:   getEnv("JWT_SECRET", ""),
		ServerPort:  getEnv("SERVER_PORT", "8080"),
		HF_ApiKey:   getEnv("HF_API_KEY", ""),
	}
}

func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if exists {
		return value
	}
	return defaultValue
}
