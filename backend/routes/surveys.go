package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)


func createSurvey(context *gin.Context) { 
	var survey models.Survey

	err := context.ShouldBindJSON(&survey)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message":"Could not parse incoming data"})
		return
	}

	err = survey.Create()

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message":"Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message":"Successfully created survey"})
}

func getCompanySurveys(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("companyId"), 10, 64)

	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message":"Could not parse incoming data"})
		return
	}

	surveys, err := models.GetCompanySurveys(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message":"Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"surveys": surveys})
}

func GetSurveyQuestions(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("surveyId"), 10, 64)

	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message":"Could not parse incoming data"})
		return
	}

	questions, err := models.GetSurveyQuestions(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message":"Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"questions": questions})
}

// func getUserAnsweredSurveys(context *gin.Context) { 
// 	id, err := strconv.ParseInt(context.Param("userId"), 10, 64)


// 	if err != nil {
// 		fmt.Println(err)
// 		context.JSON(http.StatusBadRequest, gin.H{"message":"Could not parse incoming data"})
// 		return
// 	}
// }