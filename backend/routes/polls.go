package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)

func createPoll(context *gin.Context) { 
	var poll models.Poll

	err := context.ShouldBindJSON(&poll)

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse data"})
		return
	}

	err = poll.Create()

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully created poll"})
}

func getCompanyPolls(context *gin.Context) {
	id, err := strconv.ParseInt(context.Param("companyId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not read company id"})
		return
	}

	polls, err := models.GetCompanyPolls(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error", "err": err})
		return
	}

	context.JSON(http.StatusOK, gin.H{"polls": polls})
}