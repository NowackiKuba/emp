package routes

import "github.com/gin-gonic/gin"

func RegisterRoutes(server *gin.Engine) { 
	server.POST("/signup", signup)
	server.POST("/create-employee", createEmployee)
	server.POST("/login", login)
	server.GET("/user/:token", getUser)
	server.GET("/user-by-id/:id", getUserById)
	server.POST("/create-company", createCompanyAccount)
	server.GET("/company/:token", getCompany)
	server.GET("/employees/:token", getCompanyEmployees)
}