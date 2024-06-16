package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)

func createQuestion(context *gin.Context) { 
	var question models.Question

	err := context.ShouldBindJSON(&question)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	err = question.Create()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully created new question"})
}


func getCompanyQuestions(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("companyId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}


	questions, err := models.GetCompanyQuestions(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"questions": questions})

}

func answerQuestion(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("questionId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	var question models.Question

	err = context.ShouldBindJSON(&question)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	question.ID = int32(id)

	err = question.Update()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully answered question"})

}