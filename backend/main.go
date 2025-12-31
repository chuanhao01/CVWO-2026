package main

import (
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	envVars := utils.GetEnv()
	if envVars.APP_ENV == "DEV" {
		gin.SetMode(gin.DebugMode)
	} else if envVars.APP_ENV == "PROD" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.POST("/createUserByUsernameAndEmail", createUserByUsernameAndEmail)
	router.Run(envVars.GIN_URL)
}

// Handlers
type createUserByUsernameAndEmailBody struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func createUserByUsernameAndEmail(c *gin.Context) {
	var json createUserByUsernameAndEmailBody
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "User created successfully"})
}
