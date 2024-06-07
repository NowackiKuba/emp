package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"movies.app/movies/models"
	"movies.app/movies/utils"
)

func signup(context *gin.Context) { 
	var user models.User

	err := context.ShouldBindJSON(&user);

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Smth wen wrong"})
		return
	}

	err = user.Create()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error", "error": err})
		return
	}


	context.JSON(http.StatusOK, gin.H{"user": user})
	
}

func login(context *gin.Context) { 
	var user models.User

	err := context.ShouldBindJSON(&user);

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	err = user.ValidateCredentials(user.Email, user.Password)

	if err != nil { 
		context.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	token, err := utils.GenerateToken(user.Email, user.ID.Hex())

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not authenticate user"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Logged in successfully", "token": token})
}
