package routes

import "github.com/gin-gonic/gin"


func RegisterRoutes(server *gin.Engine) { 
	server.PATCH("/task/:taskId", updateTask)
	server.POST("/signup", signup)
	server.POST("/login", login)
	server.POST("/create-company", createCompany)
	server.POST("/create-employee", createEmployeeAccount)
	server.POST("/pto", createPto)
	server.POST("/task", createTask)
	server.POST("/poll", createPoll)
	server.POST("/answer", answerPoll)
	server.PATCH("/pto/:ptoId", getCompanyPtos)
	server.PATCH("/start-work/:userId", startWork)
	server.GET("/employees/:companyId", getCompanyUsers)
	server.GET("/user/:id", getUserById)
	server.GET("/pto/:companyId", getCompanyPtos)
	server.GET("/tasks/:companyId", getCompanyTasks)
	server.GET("/task/:id", getTaskById)
	server.GET("/polls/:companyId", getCompanyPolls)
	server.GET("/answers/:pollId", getPollAnswers)
	server.DELETE("/task/:id")
}