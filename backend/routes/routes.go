package routes

import "github.com/gin-gonic/gin"


func RegisterRoutes(server *gin.Engine) { 
	server.PATCH("/task/:taskId", updateTask)
	server.POST("/signup", signup)
	server.POST("/login", login)
	server.POST("/create-company", createCompany)
	server.POST("/create-employee", createEmployeeAccount)
	server.POST("/task", createTask)
	server.POST("/poll", createPoll)
	server.GET("/employees/:companyId", getCompanyUsers)
	server.GET("/user/:id", getUserById)
	server.GET("/tasks/:companyId", getCompanyTasks)
	server.GET("/task/:id", getTaskById)
	server.GET("/polls/:companyId", getCompanyPolls)
	server.GET("/answers/:pollId", getPollAnswers)
	server.DELETE("/task/:id")
}