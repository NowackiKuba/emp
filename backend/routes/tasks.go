package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/employees/models"
	"github.com/gin-gonic/gin"
)


func createTask(context *gin.Context) { 

	var task models.Task

	err := context.ShouldBindJSON(&task)
	
	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
		return
	}

	err = task.Create()

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}
	context.JSON(http.StatusOK, gin.H{"task": task})

}

func getCompanyTasks(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("companyId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse company id"})
		return
	}

	tasks, err := models.GetCompanyTasks(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}


	context.JSON(http.StatusOK, gin.H{"tasks": tasks})
}

// func deleteTask(context *gin.Context) { 
// 	taskId, err := strconv.ParseInt(context.Param("id"), 10, 64)

// 	if err != nil { 
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
// 		return
// 	}

// 	// task, err := models.GetTask(int32(taskId))
// 	err = models.DeleteTask

// 	if err != nil { 
// 		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
// 		return
// 	}

// 	context.JSON(status)
	
// }

func getTaskById(context *gin.Context) { 
	taskId, err := strconv.ParseInt(context.Param("id"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
		return
	}

	task, err := models.GetTask(int32(taskId))

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"task": task})
}


func updateTask(context *gin.Context) { 
	taskId, err := strconv.ParseInt(context.Param("taskId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id, try again later"})
		return
	}

	var updatedTask models.Task

	err = context.ShouldBindJSON(&updatedTask)

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse request data, try again later"})
		return
	}

	updatedTask.ID = int32(taskId)
	err = updatedTask.Update()

	if err != nil { 
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse request data, try again later"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully updated task"})
}


func getEmployeeTasks(context *gin.Context) { 
	id, err := strconv.ParseInt(context.Param("userId"), 10, 64)

	if err != nil { 
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse company id"})
		return
	}

	tasks, err := models.GetUserTasks(int32(id))

	if err != nil { 
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}


	context.JSON(http.StatusOK, gin.H{"tasks": tasks})
}