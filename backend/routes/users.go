package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/employees/models"
	"example.com/employees/utils"
	"github.com/gin-gonic/gin"
)

func signup(context *gin.Context) { 

	var user models.User

	err := context.ShouldBindJSON(&user)
	
	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	err = user.Save()

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
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

	err = user.ValidateCredentials()

	if err != nil { 
		context.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	dbUser, err := models.GetUser(user.ID)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	token, err := utils.GenerateToken(user.Email, user.ID, dbUser.CompanyID)

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not authenticate user"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Logged in successfully", "token": token})
}

func getCompanyUsers(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("companyId"), 10, 64)

	if err != nil { 

		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	users, err := models.GetCompanyUsers(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server Error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"employees": users})


}

func getUserById(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("id"), 10, 64)

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	user, err := models.GetUser(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server Error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"user": user})
}

func createEmployeeAccount(context *gin.Context) { 
	var user models.User

	err := context.ShouldBindJSON(&user)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	err = user.CreateEmployee()	

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully created employee"})
}

func startWork(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("userId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	err = models.StartWork(int32(id))

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Work Started"})
}

func updateEmployee(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("userId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	var updatedEmployee models.User

	err = context.ShouldBindJSON(&updatedEmployee)

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse request data, try again later"})
		return
	}

	updatedEmployee.ID = int32(id)
	err = updatedEmployee.Update()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully updated employee"}) 
}

func deleteEmployee(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("id"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	err = models.DeleteEmployee(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully deleted user"})
}