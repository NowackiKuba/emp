package main

import (
	"fmt"

	"example.com/employees/db"
	"example.com/employees/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	db.Connect()
	server := gin.Default()

	routes.RegisterRoutes(server)

	err := server.Run(":8080")
	if err != nil { 
		fmt.Print(err)
	}

}