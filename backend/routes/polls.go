package routes

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

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
	query_startDate, ok := context.GetQuery("start_date")
	if !ok { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not read start date"})
		return
	}
	query_endDate, ok := context.GetQuery("end_date")
	if !ok { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not read end date"})
		return
	}
	id, err := strconv.ParseInt(context.Param("companyId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not read company id"})
		return
	}

	layout := "01-02-2006 3:04"

	startDate, err := time.Parse(layout, query_startDate)
	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse start date"})
		return
	}
	endDate, err := time.Parse(layout, query_endDate)

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse end date"})
		return
	}

	polls, err := models.GetCompanyPolls(int32(id), startDate, endDate)

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error", "err": err})
		return
	}

	context.JSON(http.StatusOK, gin.H{"polls": polls})
}
