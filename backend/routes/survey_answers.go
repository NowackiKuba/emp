package routes

import (
	"fmt"
	"net/http"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)

func AnswerSurvey(context *gin.Context) { 
	var surveyAnswer models.SurveyAnswer

	err := context.ShouldBindJSON(&surveyAnswer)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	err = surveyAnswer.Create()

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully answered survey"})
}