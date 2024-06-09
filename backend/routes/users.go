package routes

import (
	"fmt"
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

	 err, id := user.Create()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error", "error": err})
		return
	}


	context.JSON(http.StatusOK, gin.H{"userId": id})
	
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

	token, err := utils.GenerateToken(user.Email, user.ID.Hex(), user.Company.Hex())

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not authenticate user"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Logged in successfully", "token": token})
}


func getUser(context *gin.Context) { 
		token := context.Param("token")
		if len(token) <= 0 { 
			context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
			return
		}
		userId, err := utils.VerifyToken(token, "user")


		if err != nil { 
			context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
			return
		}

		user, err := models.GetUserById(userId)
		
		if err != nil { 
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch event, try again later", "error": err})
			return
		}
	
		context.JSON(http.StatusOK, gin.H{"user": user})
	
}


func getUserById(context *gin.Context) { 
	id := context.Param("id")
		if len(id) <= 0 { 
			context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse user id, try again later"})
			return
		}
		



		user, err := models.GetUserById(id)
		
		if err != nil { 
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch event, try again later", "error": err})
			return
		}
	
		context.JSON(http.StatusOK, gin.H{"user": user})
} 

func createEmployee(context *gin.Context) { 
	var user models.User

	err := context.ShouldBindJSON(&user);

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Smth wen wrong"})
		return
	}

	 err, id := user.CreateEmployee()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error", "error": err})
		return
	}


	context.JSON(http.StatusOK, gin.H{"userId": id})
	
}