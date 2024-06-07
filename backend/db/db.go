package db

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


func Connect() (*mongo.Client, error) { 
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://kontaktidtag:T2FNl4W5cI2oQRwW@cluster0.ihedwpe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").SetServerAPIOptions(serverAPI)
  
	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
	//   panic(err)
	return nil, err
	}
  

  
	// Send a ping to confirm a successful connection
	if err := client.Database("movies-app").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		return nil, err
	} else { 

	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")
	}
	return client, nil
}