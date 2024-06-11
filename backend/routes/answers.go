package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)

func getPollAnswers(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("pollId"), 10, 64)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse poll's ID"})
		return
	}

	answers, err := models.GetPollAnswers(int32(id))

	if err != nil  { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"answers": answers})
}