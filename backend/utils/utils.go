package utils

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

type envVar struct {
	DB_URL string
}

var envVars *envVar

func getLogger() *slog.Logger {
	return GetLogger().WithGroup("utils")
}

func loadEnv() {
	logger := getLogger()

	app_env := os.Getenv("APP_ENV")
	// Empty means dev mode
	if "" == app_env {
		app_env = "DEV"
	}

	logger.Info("loadEnv", slog.String("APP_ENV", app_env))

	// Always load prod first
	godotenv.Load(fmt.Sprintf("%s/%s", ENV_DIR, ".env.prod"))
	if app_env == "DEV" {
		godotenv.Load(fmt.Sprintf("%s/%s", ENV_DIR, ".env.dev"))
	}
}

func GetEnv() *envVar {
	logger := getLogger()

	if envVars == nil {
		loadEnv()
		envVars = &envVar{DB_URL: os.Getenv("DB_URL")}
		logger.Info("Loaded envVars")
	}
	return envVars
}

func GetLogger() *slog.Logger {
	return slog.Default()
}
