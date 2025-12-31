package utils

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

type envVar struct {
	APP_ENV string
	DB_URL  string
	GIN_URL string
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
	envVars.APP_ENV = app_env

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
		envVars = &envVar{}
		loadEnv()
		envVars.DB_URL = os.Getenv("DB_URL")
		envVars.GIN_URL = os.Getenv("GIN_URL")
		logger.Info("Loaded envVars")
	}
	return envVars
}

func GetLogger() *slog.Logger {
	return slog.Default()
}
