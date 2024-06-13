package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)


func endWork(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("userId"), 10, 64)

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	var userWorkDay models.UserWorkingDays
	err = context.ShouldBindJSON(&userWorkDay)

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	err = models.EndWork(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	err = userWorkDay.Create()

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully ended work day"})

}

func getUserWorkHistory(context *gin.Context) {
	id, err := strconv.ParseInt(context.Param("userId"), 10, 64)

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	history, err := models.GetUserWorkHistory(int32(id))

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return 
	}

 	context.JSON(http.StatusOK, gin.H{"history": history})
}