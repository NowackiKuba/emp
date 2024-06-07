package models

import (
	"context"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"movies.app/movies/db"
	"movies.app/movies/utils"
)

type User struct { 
	ID primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	FirstName string `bson:"firstName,omitempty" json:"firstName"`
	LastName string `bson:"lastName,omitempty" json:"lastName"`
	Email string `bson:"email,omitempty" json:"email"`
	Username string `bson:"username,omitempty" json:"username"`
	Password string `bson:"password,omitempty" json:"password"`
}

func (u *User) Create() error { 
	client, err := db.Connect()

	if err != nil {
		return err
	}

	defer func() {
	  if err = client.Disconnect(context.TODO()); err != nil {
		panic(err)
	  }
	}()


	db := client.Database("movies-app")

	fmt.Println("db", db)
	users := db.Collection("users")

	var ctx, _ = context.WithTimeout(context.Background(), 100*time.Second)
	  
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), 14) 

	if err != nil { 
		return err
	}
	  
	result, err := users.InsertOne(ctx, User{
		FirstName: u.FirstName,
		LastName: u.LastName,
		Email: u.Email,
		Username: u.Username,
		Password: string(hashedPassword),
	})

	if err != nil { 
		fmt.Println(err)
		return err
	}

	fmt.Println(result)
	return nil
}

func (u *User) ValidateCredentials(email string, password string) error { 
	client, err := db.Connect()

	if err != nil {
		return err
	}

	defer func() {
	  if err = client.Disconnect(context.TODO()); err != nil {
		panic(err)
	  }
	}()


	db := client.Database("movies-app")

	users := db.Collection("users")

	var ctx, _ = context.WithTimeout(context.Background(), 100*time.Second)
    filter := bson.M{"email": bson.M{"$eq": email}}

	err = users.FindOne(ctx, filter).Decode(&u)

	if err != nil { 
		return errors.New("new error")
	}
	fmt.Printf("User Password: %v, Provided Pass %v", u.Password, password)
	passwordIsValid := utils.CheckPasswordHash(password, u.Password)
	
	if !passwordIsValid { 
			// fmt.Println("ERRROR HERE")
			return errors.New("invalid credentials")
		}
		return nil
	}
		