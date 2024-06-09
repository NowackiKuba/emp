package models

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"movies.app/movies/db"
)


type Company struct { 
	ID primitive.ObjectID `bson:"_id, omitempty" json:"_id"`
	Name string `bson:"name," json:"name"`
	Email string `bson:"email," json:"email"`
	LogoUrl string `bson:"logoUrl," json:"logoUrl"`
	Users []primitive.ObjectID `bson:"users," json:"users"`
}


func (c *Company) Create() (string, error) { 
	client, err := db.Connect()

	if err != nil {
		return "", err
	}

	defer func() {
	  if err = client.Disconnect(context.TODO()); err != nil {
		panic(err)
	  }
	}()


	db := client.Database("movies-app")

	companies := db.Collection("companies")

	var ctx, _ = context.WithTimeout(context.Background(), 100*time.Second)
	  

	if err != nil { 
		return "", err
	}
	  
	result, err := companies.InsertOne(ctx, Company{
		ID: primitive.NewObjectID(),
		Name: c.Name,
		Email: c.Email,
		LogoUrl: c.LogoUrl,
		Users: c.Users,
	})

	if err != nil { 
		fmt.Println(err)
		return "",err
	}

	insertedID, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		return "", fmt.Errorf("failed to convert InsertedID to primitive.ObjectID")
	}

	return insertedID.Hex(), nil
}

func GetCompany(id string) (*Company, error) { 
	var company Company

	client, err := db.Connect()

	if err != nil {
		return nil, err
	}

	defer func() {
	  if err = client.Disconnect(context.TODO()); err != nil {
		panic(err)
	  }
	}()


	db := client.Database("movies-app")

	companies := db.Collection("companies")

	// var ctx, _ = context.WithTimeout(context.Background(), 100*time.Second)
	companyId, err := primitive.ObjectIDFromHex(id)
	if err != nil { 
		return nil, err
	}
    filter := bson.M{"_id": bson.M{"$eq": companyId}}

	err = companies.FindOne(context.TODO(), filter).Decode(&company)

	if err != nil { 
		return nil, err
	}

	return &company, nil

}

func GetCompanyEmployees(id string) (*[]User, error) { 
	var users []User

	client, err := db.Connect()

	if err != nil {
		return nil, err
	}

	defer func() {
	  if err = client.Disconnect(context.TODO()); err != nil {
		panic(err)
	  }
	}()


	db := client.Database("movies-app")
	usersCollection := db.Collection("users")

	//  ctx, _ := context.WithTimeout(context.Background(), 100*time.Second)
	companyId, err := primitive.ObjectIDFromHex(id)
	if err != nil { 
		return nil, err
	}
    filter := bson.M{"company": bson.M{"$eq": companyId}}
	// fmt.Println("companyId", companyId.Hex())
	cur, err := usersCollection.Find(context.TODO(), filter)
	
	if err != nil { 
		return nil, err
	}
	for cur.Next(context.TODO()) { 
		var elem User
		err := cur.Decode(&elem)
		if err != nil { 
			log.Fatal(err)
		}

		users = append(users, elem)
	}

	if err := cur.Err(); err != nil {
        log.Fatal(err)
    }

    //Close the cursor once finished
    cur.Close(context.TODO())

	return &users, nil
}
