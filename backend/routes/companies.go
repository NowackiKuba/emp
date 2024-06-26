package routes

import (
	"fmt"
	"net/http"
	"strconv"

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



func getCompany(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("id"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	company, err := models.GetCompany(int32(id))

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"company": company})
}


func updateCompany(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("id"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}
	
	var company models.Company

	err = context.ShouldBindJSON(&company)


	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	company.ID = int32(id)
	err = company.Update()

	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}


	context.JSON(http.StatusOK, gin.H{"message": "Successfully updated company"})
}