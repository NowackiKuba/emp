package routes

import (
	"fmt"
	"net/http"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)


func createCompany(context *gin.Context) {
	var company models.Company

	err := context.ShouldBindJSON(&company)
	
	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	companyId, err := company.Create()

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}
	context.JSON(http.StatusOK, gin.H{"companyId": companyId})
}

