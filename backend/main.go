package main

import (
	"github.com/gin-gonic/gin"
	"movies.app/movies/routes"
)
  
  func main() {

	server := gin.Default()
	routes.RegisterRoutes(server)

	server.Run(":8080")
  }
  