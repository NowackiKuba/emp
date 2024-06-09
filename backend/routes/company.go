package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"movies.app/movies/models"
	"movies.app/movies/utils"
)


func createCompanyAccount(context *gin.Context) {
	var company models.Company

	err := context.ShouldBindJSON(&company);

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Smth wen wrong"})
		return
	}

	resultId, err := company.Create()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error", "error": err})
		return
	}

	userId := company.Users[0]
	companyId, err := primitive.ObjectIDFromHex(string(resultId))

	err = models.AssignToCompany(companyId, userId)
	if err != nil { 
		fmt.Println("ERROR HERE")
		 context.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
	}

	context.JSON(http.StatusOK, gin.H{"company": company})
}


func getCompany(context *gin.Context) { 
	token := context.Param("token")
		if len(token) <= 0 { 
			context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
			return
		}
		companyId, err := utils.VerifyToken(token, "company")


		if err != nil { 
			context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
			return
		}

		company, err := models.GetCompany(companyId)
		
		if err != nil { 
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch event, try again later", "error": err})
			return
		}
	
		context.JSON(http.StatusOK, gin.H{"company": company})
}
func getCompanyEmployees(context *gin.Context) { 
	token := context.Param("token")
		if len(token) <= 0 { 
			context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
			return
		}
		companyId, err := utils.VerifyToken(token, "company")


		if err != nil { 
			context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
			return
		}

		employees, err := models.GetCompanyEmployees(companyId)
		
		if err != nil { 
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch event, try again later", "error": err})
			return
		}
	
		context.JSON(http.StatusOK, gin.H{"employees": employees})
}