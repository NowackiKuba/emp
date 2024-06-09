package routes

import "github.com/gin-gonic/gin"


func RegisterRoutes(server *gin.Engine) { 
	server.POST("/signup", signup)
	server.POST("/login", login)
	server.POST("/create-company", createCompany)
	server.POST("/create-employee", createEmployeeAccount)
	server.POST("/task", createEmployeeAccount)
	server.GET("/employees/:companyId", getCompanyUsers)
	server.GET("/user/:id", getUserById)
}