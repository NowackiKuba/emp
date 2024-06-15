package routes

import (
	"net/http"
	"strconv"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)

func CreateNotification(context *gin.Context) { 
	var notification models.Notification

	err := context.ShouldBindJSON(&notification)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse data"})
		return
	}

	err = notification.Create()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully created notification"})
}

func getUserNotifications(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("userId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	notifications, err := models.GetUserNotifications(int32(id))

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"notifications": notifications})
}

func readNotification(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("notificationId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}
	var notification models.Notification

	err = context.ShouldBindJSON(&notification)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	notification.ID = int32(id)
	err = notification.ReadNotification()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}


	context.JSON(http.StatusOK, gin.H{"message": "Successfully read notification"})
}

func deleteNotification(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("notificationId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	notification, err := models.GetNotification(int32(id))
	// userId := context.GetInt64("userId")
	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	// if notification.ToId != 

	err = notification.Delete()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully deleted notification"})
}