package routes

import (
	"fmt"
	"net/http"
	"strconv"

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

func getSurveyAnswers(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("surveyId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	answers, err := models.GetSurveyAnswers(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"answers": answers})
}
func getUserAnsweredSurveys(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("userId"), 10, 64)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse poll's ID"})
		return
	}

	surveys, err := models.GetUseredAnsweredSurveys(int32(id))

		if err != nil {
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

	context.JSON(http.StatusOK, gin.H{"surveys": surveys})
}