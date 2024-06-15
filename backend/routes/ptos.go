package routes

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)

func createPto(context *gin.Context) { 
	var pto models.PTO

	err := context.ShouldBindJSON(&pto)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not bind data"})
		return
	}

	err = pto.Create()

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully created POLL"})

}

func getCompanyPtos(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("companyId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse data"})
		return
	}

	ptos, err := models.GetCompanyPTOs(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"ptos": ptos})
}

func updatePTO(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("ptoId"), 10, 64)
	
	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse data"})
		return
	}

	userId, err := strconv.ParseInt(context.Query("userId"), 10 ,64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse data"})
		return
	}

	var updatedPTO models.PTO

	err = context.ShouldBindJSON(&updatedPTO)
	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	updatedPTO.ID = int32(id)

	err, result := updatedPTO.Update()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}
	var message string
	if result { 
		message = "Your PTO Request has been accepted"
	} else { 
		message = "Your PTO Request has been rejected"
	}

	notification := models.Notification{
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Title: "Your PTO Request Result",
		Message: message,
		ToId: int32(userId),
		IsRead: false,
	}

	err = notification.Create()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Sucessfully updated pto"})
}