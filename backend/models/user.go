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
	Password string `bson:"password,omitempty" json:"password"`
	ImgUrl string `bson:"imgUrl,omitempty" json:"imgUrl"`
	CreatedAt time.Time `bson:"createdAt,omitempty" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt,omitempty" json:"updatedAt"`
	Role string `bson:"role" json:"role"`
	Company primitive.ObjectID `bson:"company, omitempty" json:"company"`
	Position string `bson:"position" json:"position"`
	IsOnVacation bool `bson:"isOnVacation, omitempty" json:"isOnVacation"`
	IsOnBreak bool `bson:"isOnBreak, omitempty" json:"isOnBreak"`
	WorkStart time.Time `bson:"workStart, omitempty" json:"workStart"`
	WorkEnd time.Time `bson:"workEnd, omitempty" json:"workEnd"`
	IsWorking bool `bson:"isWorking, omitempty" json:"isWorking"`

}

func (u *User) Create() (error, any) { 
	client, err := db.Connect()

	if err != nil {
		return err, nil
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
		return err, nil
	}
	  
	result, err := users.InsertOne(ctx, User{
		ID: primitive.NewObjectID(),
		FirstName: u.FirstName,
		LastName: u.LastName,
		Email: u.Email,
		Password: string(hashedPassword),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		IsWorking: false,
	})

	if err != nil { 
		fmt.Println(err)
		return err, nil
	}

	return nil, result.InsertedID
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

	passwordIsValid := utils.CheckPasswordHash(password, u.Password)
	fmt.Println(password, u.Password)
	
	if !passwordIsValid { 
			fmt.Println(password)
			return errors.New("invalid credentials")
		}
		return nil
	}
		

func GetUserById(id string) (*User, error) {
	var user User

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

	users := db.Collection("users")

	var ctx, _ = context.WithTimeout(context.Background(), 100*time.Second)
	userId, err := primitive.ObjectIDFromHex(id)
	if err != nil { 
		return nil, err
	}
    filter := bson.M{"_id": bson.M{"$eq": userId}}

	err = users.FindOne(ctx, filter).Decode(&user)

	if err != nil { 
		return nil, err
	}

	return &user, nil

}


func AssignToCompany(companyId, userId primitive.ObjectID) error { 
	var user User

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

    filter := bson.M{"_id": bson.M{"$eq": userId}}
	update := bson.M{
		"$set": bson.M{"company": companyId},
	}

	err = users.FindOneAndUpdate(ctx, filter, update).Decode(&user)

	return err



}


func (u *User) CreateEmployee() (error, any) {
	client, err := db.Connect()

	if err != nil {
		return err, nil
	}

	defer func() {
	  if err = client.Disconnect(context.TODO()); err != nil {
		panic(err)
	  }
}()


	db := client.Database("movies-app")
	users := db.Collection("users")

	var ctx, _ = context.WithTimeout(context.Background(), 100*time.Second)
	  
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), 14) 

	if err != nil { 
		return err, nil
	}
	  


	result, err := users.InsertOne(ctx, User{
		ID: primitive.NewObjectID(),
		FirstName: u.FirstName,
		LastName: u.LastName,
		Email: u.Email,
		Password: string(hashedPassword),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Position: u.Position,
		Role: u.Role,
		Company: u.Company,
		IsOnVacation: false,
		IsOnBreak: false,
		IsWorking: false,
		ImgUrl: u.ImgUrl,
	})

	if err != nil { 
		return err, nil
	}

	return nil, result.InsertedID
}