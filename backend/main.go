package main

import (
	"backend/db"
	"backend/utils"
	"log/slog"
	"net/http"
	"net/mail"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	envVars := utils.GetEnv()
	if envVars.APP_ENV == "DEV" {
		gin.SetMode(gin.DebugMode)
	} else if envVars.APP_ENV == "PROD" {
		gin.SetMode(gin.ReleaseMode)
	}

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{envVars.FRONTEND_URL}

	router := gin.Default()
	router.Use(cors.New(config))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.POST("/createUserByUsernameAndEmail", createUserByUsernameAndEmail)
	router.POST("/checkUsername", checkUsername)
	router.POST("/checkEmail", checkEmail)
	router.POST("/verifyUserLogin", verifyUserLogin)

	router.Run(envVars.GIN_URL)
}

// Handlers

// Helper to create the logger used by all handlers and adds context
func getHandlerLogger(handler string, c *gin.Context) *slog.Logger {
	logger := utils.GetLogger().WithGroup(handler)
	return logger
}

// Helper to handle error from JSON bind errors
// Returns true if errors
func handlerBindJsonHelper(obj any, c *gin.Context, logger *slog.Logger) bool {
	if err := c.ShouldBindBodyWithJSON(obj); err != nil {
		logger.With(slog.String("err", err.Error())).Info("Bind Json error")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bind Error"})
		return true
	}
	return false
}

type createUserByUsernameAndEmailBody struct {
	Username string `json:"username" binding:"required,min=3"`
	Email    string `json:"email" binding:"required,min=10"`
	Password string `json:"password" binding:"required,min=5"`
}

func createUserByUsernameAndEmail(c *gin.Context) {
	logger := getHandlerLogger("createUserByUsernameAndEmail", c)
	var json createUserByUsernameAndEmailBody
	if handlerBindJsonHelper(&json, c, logger) {
		return
	}

	// Validate Email
	if _, err := mail.ParseAddress(json.Email); err != nil {
		logger.With(slog.String("email", json.Email)).Info("Email Validation error")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
		return
	}

	if err := db.CreateUserByUsernameAndEmail(logger, json.Username, json.Email, json.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to create User"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"msg": "User created successfully"})
}

type checkUsernameBody struct {
	Username string `json:"username" binding:"required,min=3"`
}

func checkUsername(c *gin.Context) {
	logger := getHandlerLogger("checkUsername", c)
	var json checkUsernameBody
	if handlerBindJsonHelper(&json, c, logger) {
		return
	}

	isUnique, err := db.IsUsernameUnique(logger, json.Username)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to check username"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"isUnique": isUnique})
}

type checkEmailBody struct {
	Email string `json:"email" binding:"required,min=10"`
}

func checkEmail(c *gin.Context) {
	logger := getHandlerLogger("checkEmail", c)
	var json checkEmailBody
	if handlerBindJsonHelper(&json, c, logger) {
		return
	}

	isUnique, err := db.IsEmailUnique(logger, json.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to check email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"isUnique": isUnique})
}

type verifyUserLoginBody struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func verifyUserLogin(c *gin.Context) {
	logger := getHandlerLogger("verifyUserLogin", c)
	var json verifyUserLoginBody
	if handlerBindJsonHelper(&json, c, logger) {
		return
	}

	match, err := db.VerifyUserLogin(logger, json.Username, json.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to verify user login"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"match": match})
}
